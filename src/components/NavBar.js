// src/components/NavBar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function NavBar({ children }) {
  const { user, logout } = useAuth();

  const displayName = user?.name || 'Consultant';
  const roleLabel = user?.role || 'User';

  return (
    <div className="app-shell">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-avatar">
            {displayName.charAt(0)}
          </div>
          <div className="sidebar-user">
            <div className="sidebar-user-name">{displayName}</div>
            <div className="sidebar-user-role">{roleLabel}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className="sidebar-link">
            Overview
          </NavLink>
          <NavLink to="/artefacts/new" className="sidebar-link">
            Add artefact
          </NavLink>
         <NavLink to="/artefacts/browse" className="sidebar-link">
         Knowledge artefacts
         </NavLink>

          <NavLink to="/workspaces" className="sidebar-link">
            Workspaces
          </NavLink>
          <NavLink to="/leaderboard" className="sidebar-link">
            Leaderboard
          </NavLink>

          <div className="sidebar-section-label">Governance</div>
          <NavLink to="/governance/pending" className="sidebar-link">
            Pending artefacts
          </NavLink>
          <NavLink to="/governance/rules" className="sidebar-link">
            Governance rules
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button className="btn-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE: CONTENT */}
      <div className="app-main">
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default NavBar;
