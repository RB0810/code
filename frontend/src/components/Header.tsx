import React from 'react';

type HeaderProps = {
  lastUpdated?: string;
};

const Header: React.FC<HeaderProps> = ({ lastUpdated }) => {
  return (
    <header className="bg-blue-900 text-white px-6 py-4 shadow-md flex justify-between items-center flex-wrap gap-2">
      <h1 className="text-xl font-semibold">Real-Time Water Treatment Dashboard</h1>
      {lastUpdated && (
        <span className="text-sm text-blue-100">
          Last updated: <span className="font-mono">{lastUpdated}</span>
        </span>
      )}
    </header>
  );
};

export default Header;