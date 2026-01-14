// src/App.js
import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from 'react-router-dom';
import './App.css';
import { useAuth } from './auth/AuthContext';
import NavBar from './components/NavBar';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ArtefactCreatePage from './pages/ArtefactCreatePage';
import ArtefactBrowsePage from './pages/ArtefactBrowsePage';
import WorkspacePage from './pages/WorkspacePage';
import GovernancePendingPage from './pages/GovernancePendingPage';
import GovernanceRulesPage from './pages/GovernanceRulesPage';
import LeaderboardPage from './pages/LeaderboardPage';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="hint">Loading…</p>;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

/**
 * Layout used for all authenticated pages:
 * - wraps content with RequireAuth
 * - renders NavBar + main area
 */
function AuthedLayout() {
  return (
    <RequireAuth>
      <NavBar>
        <Outlet />
      </NavBar>
    </RequireAuth>
  );
}

function App() {
  return (
    <div className="app-root">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* All protected routes share the same NavBar/layout */}
        <Route element={<AuthedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/artefacts/new" element={<ArtefactCreatePage />} />
          <Route path="/artefacts/browse" element={<ArtefactBrowsePage />} />
          <Route path="/workspaces" element={<WorkspacePage />} />
          <Route path="/governance/pending" element={<GovernancePendingPage />} />
          <Route path="/governance/rules" element={<GovernanceRulesPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
