/**
 * En-tête de l'application
 */

import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
        <h1 className="text-2xl font-bold sm:text-3xl">🎲 Rubik's Solver</h1>
        <p className="text-sm text-slate-300 sm:text-base">
          Visualisez, configurez et résolvez un Rubik's Cube 3D interactif
        </p>
      </div>
    </header>
  );
};

export default Header;
