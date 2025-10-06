export default function Sidebar({ onSignOut }) {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        IMSystem
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <a href="#" className="block px-3 py-2 rounded hover:bg-gray-800">
          📦 Inventory
        </a>
        <a href="#" className="block px-3 py-2 rounded hover:bg-gray-800">
          🔁 Transactions
        </a>
        <a href="#" className="block px-3 py-2 rounded hover:bg-gray-800">
          👤 Users
        </a>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onSignOut}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
