import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

// --- Icons ---
const IconSun = () => (
  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const IconMoon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const IconLogout = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Decode user info from token
  const getUserInfo = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const user = getUserInfo();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navLinks = isAdmin
    ? [{ label: "Dashboard", path: "/admin-dashboard" }]
    : [
        { label: "Dashboard", path: "/dashboard" },
        { label: "My Posts", path: "/dashboard/myposts" },
        { label: "Create", path: "/create" },
        { label: "Profile", path: "/profile" },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* --- Navbar --- */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 h-16 border-b backdrop-blur-sm"
        style={{
          backgroundColor: dark ? "rgba(10,10,10,0.85)" : "rgba(255,255,255,0.85)",
          borderColor: "var(--border-default)",
        }}
      >
        {/* Left — Brand */}
        <button
          onClick={() => navigate(isAdmin ? "/admin-dashboard" : "/dashboard")}
          className="text-lg font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
          id="nav-brand"
        >
          CampusTales
        </button>

        {/* Center — Nav Links */}
        <nav className="hidden md:flex items-center gap-1" id="nav-links">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="px-3 py-1.5 text-sm font-medium rounded-md transition-all"
              style={{
                color: isActive(link.path) ? "var(--text-primary)" : "var(--text-secondary)",
                backgroundColor: isActive(link.path) ? "var(--bg-tertiary)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.path)) e.currentTarget.style.backgroundColor = "var(--accent-muted)";
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.path)) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-md transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-label="Toggle theme"
            id="theme-toggle"
          >
            {dark ? <IconSun /> : <IconMoon />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            style={{
              color: "var(--text-secondary)",
              border: "1px solid var(--border-default)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent-muted)";
              e.currentTarget.style.borderColor = "var(--border-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "var(--border-default)";
            }}
            id="logout-button"
          >
            <IconLogout />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* --- Mobile Nav --- */}
      <nav
        className="md:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-b"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-default)",
        }}
      >
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className="px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all"
            style={{
              color: isActive(link.path) ? "var(--text-primary)" : "var(--text-secondary)",
              backgroundColor: isActive(link.path) ? "var(--bg-tertiary)" : "transparent",
            }}
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* --- Page Content --- */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* --- Footer --- */}
      <footer
        className="px-6 py-4 text-center text-sm border-t"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-default)",
          color: "var(--text-tertiary)",
        }}
      >
        © {new Date().getFullYear()} <span className="font-medium" style={{ color: "var(--text-primary)" }}>CampusTales</span>. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
