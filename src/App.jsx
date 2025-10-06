import React from 'react';
import Dashboard from './components/Dashboard';
import TopNav from './components/TopNav';
import bg from './assets/bg.jpg';

const App = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex flex-col"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="bg-black bg-opacity-60 flex-1 flex flex-col">
        <TopNav />
        <Dashboard />
      </div>
    </div>
  );
};

export default App;
