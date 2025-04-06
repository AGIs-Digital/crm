"use client";

import React, { useState } from "react";
import Sidebar from "../navigation/Sidebar";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children = <div className="p-6">Inhalt wird geladen...</div>,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get the current module name from the pathname
  const getModuleTitle = () => {
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/kontakte")) return "Kontakte";
    if (pathname.includes("/kalender")) return "Kalender";
    if (pathname.includes("/kanban")) return "Kanban";
    if (pathname.includes("/papierkorb")) return "Papierkorb";
    return "Dashboard";
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-0 -ml-64"} md:w-64 md:ml-0 transition-all duration-300 ease-in-out h-screen bg-card border-r border-border`}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center px-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <h1 className="text-xl font-semibold ml-4">{getModuleTitle()}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto py-4 flex flex-row">
          <div className="container mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <footer className="h-12 bg-card border-t border-border flex items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">
            © 2025 callflows. Alle Rechte vorbehalten.
          </p>
        </footer>
      </div>
    </div>
  );
}
