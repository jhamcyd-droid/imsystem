import React from 'react';

const TopNav = () => {
  const buttons = [
    { label: 'Receiving', color: 'bg-green-600 hover:bg-green-700' },
    { label: 'Releasing', color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Transfer', color: 'bg-amber-500 hover:bg-amber-600' },
    { label: 'Return Slip', color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Borrow', color: 'bg-teal-600 hover:bg-teal-700' },
    { label: 'Report', color: 'bg-gray-700 hover:bg-gray-800' },
    { label: 'Weekly Monitoring', color: 'bg-red-600 hover:bg-red-700' },
  ];

  return (
    <div className="w-full bg-white/90 shadow-lg border-b border-gray-300 px-4 md:px-8 py-3 flex flex-wrap justify-center gap-3 md:gap-4 backdrop-blur-md">
      {buttons.map((btn, index) => (
        <button
          key={index}
          className={`${btn.color} text-white font-medium px-4 md:px-5 py-2 rounded-xl shadow transition active:scale-95`}
          onClick={() => console.log(`${btn.label} clicked`)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default TopNav;
