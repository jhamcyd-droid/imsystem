import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function InventoryTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [page, setPage] = useState(1);
  const [flashColumn, setFlashColumn] = useState(null);
  const pageSize = 100;

  // 🔹 Load up to 10,000 rows from Supabase
  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .range(0, 9999);
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching items:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Initial load + auto refresh every 60 sec
  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🔍 Filtering
  const filteredItems = items.filter((item) => {
    const matchesDept =
      selectedDept === 'All' || item.department === selectedDept;
    const matchesSearch =
      item.item_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // ↕️ Sorting logic (keeps active across pages)
  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return filteredItems;
    const sorted = [...filteredItems];
    sorted.sort((a, b) => {
      const aVal = a[sortConfig.key] ?? '';
      const bVal = b[sortConfig.key] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === 'asc'
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });
    return sorted;
  }, [filteredItems, sortConfig]);

  const handleHeaderDoubleClick = (key) => {
    setSortConfig((prev) => {
      let newConfig;
      if (prev.key === key) {
        if (prev.direction === 'asc') newConfig = { key, direction: 'desc' };
        else if (prev.direction === 'desc')
          newConfig = { key: null, direction: null };
        else newConfig = { key, direction: 'asc' };
      } else {
        newConfig = { key, direction: 'asc' };
      }

      // Highlight sorted column briefly
      setFlashColumn(key);
      setTimeout(() => setFlashColumn(null), 700);

      return newConfig;
    });
  };

  // 🔢 Pagination
  const totalPages = Math.ceil(sortedItems.length / pageSize);
  const paginatedItems = sortedItems.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const departments = [
    'All',
    ...new Set(items.map((i) => i.department).filter(Boolean)),
  ];

  // 🔒 Reset on logout
  const handleLogout = () => {
    setSortConfig({ key: null, direction: null });
    setSelectedDept('All');
    setSearchTerm('');
    setPage(1);
    alert('You have logged out. Sorting and filters have been reset.');
  };

  return (
    <div
      className="p-4 bg-white bg-opacity-80 rounded-xl shadow-lg"
      style={{
        border: '1px solid #ccc',
        maxHeight: '85vh',
        overflow: 'hidden',
      }}
    >
      {/* Controls */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-2 items-center">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {departments.map((dept) => (
              <option key={dept}>{dept}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search item..."
            className="border px-2 py-1 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="bg-gray-400 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            ◀ Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="bg-gray-400 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Next ▶
          </button>
          <button
            onClick={fetchItems}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-600">Loading inventory...</p>
      ) : (
        <div
          style={{
            maxHeight: '70vh',
            overflowY: 'auto',
            border: '1px solid #ddd',
          }}
        >
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                {[
                  { key: 'container', label: 'Container' },
                  { key: 'rack', label: 'Rack' },
                  { key: 'level', label: 'Level' },
                  { key: 'item_code', label: 'Item Code' },
                  { key: 'description', label: 'Description' },
                  { key: 'uom', label: 'UOM' },
                  { key: 'quantity', label: 'Quantity' },
                ].map(({ key, label }) => {
                  const isSorted = sortConfig.key === key;
                  const isFlashing = flashColumn === key;
                  return (
                    <th
                      key={key}
                      className={`border px-2 py-1 select-none cursor-pointer transition-all duration-300 ${
                        isFlashing
                          ? 'bg-blue-300'
                          : isSorted
                          ? 'bg-blue-200'
                          : 'hover:bg-gray-300'
                      }`}
                      onDoubleClick={() => handleHeaderDoubleClick(key)}
                    >
                      {label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-2 text-gray-500">
                    No items found
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border px-2 py-1">{item.container}</td>
                    <td className="border px-2 py-1">{item.rack}</td>
                    <td className="border px-2 py-1">{item.level}</td>
                    <td className="border px-2 py-1">{item.item_code}</td>
                    <td className="border px-2 py-1">{item.description}</td>
                    <td className="border px-2 py-1">{item.uom}</td>
                    <td className="border px-2 py-1 text-right">
                      {item.quantity}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-gray-600 text-sm mt-2">
        Page {page} of {totalPages}
      </div>
    </div>
  );
}
