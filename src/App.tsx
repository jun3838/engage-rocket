import { useState } from 'react';
import Survey from './apps/dashboard/pages/Survey';
import Dashboard from './apps/dashboard/pages/Dashboard';
import Button from './shared/components/Button';

export default function App() {
  const [view, setView] = useState<'survey' | 'admin'>('survey');

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="flex gap-4 mb-6">
        <Button
          className={view === 'survey' ? '' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}
          onClick={() => setView('survey')}
        >
          Survey
        </Button>
        <Button
          className={view === 'admin' ? '' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}
          onClick={() => setView('admin')}
        >
          Admin
        </Button>
      </div>
      {view === 'survey' ? <Survey /> : <Dashboard />}
    </main>
  );
}