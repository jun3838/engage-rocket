import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';

import Survey from '@/apps/survey';
import Dashboard from '@/apps/dashboard';
import { ROUTES } from '@/shared/routes';

export default function App() {
  return (
    <Router>
      <main className="min-h-screen bg-gray-100">
        <nav className="flex gap-4 bg-gray-200 p-4 shadow">
          <NavLink to={ROUTES.DASHBOARD}>
            {({ isActive }) => (
              <span className={isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-500'}>Dashboard</span>
            )}
          </NavLink>
          <NavLink to={ROUTES.SURVEY}>
            {({ isActive }) => (
              <span className={isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-500'}>Survey</span>
            )}
          </NavLink>
        </nav>

        <div className="p-6">
          <Routes>
            <Route path={ROUTES.HOME} element={<Navigate to="/dashboard" replace />} />
            <Route path={ROUTES.SURVEY} element={<Survey />} />
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}
