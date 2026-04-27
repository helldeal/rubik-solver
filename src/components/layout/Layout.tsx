/**
 * Layout principal de l'application
 */

import React from "react";
import type { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-slate-50">
      <Header />
      <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
    </div>
  );
};

export default Layout;
