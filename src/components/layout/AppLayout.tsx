import { Outlet } from 'react-router';
import { TopBar } from './TopBar';

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
