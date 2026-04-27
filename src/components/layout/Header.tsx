/**
 * En-tête de l'application
 */

import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">🎲 Rubik's Solver</h1>
        <p className="text-blue-100 text-sm mt-1">
          Visualisez, configurez et résolvez un Rubik's Cube 3D interactif
        </p>
      </div>
    </header>
  );
};

export default Header;
