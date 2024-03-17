import { Outlet } from 'react-router-dom';
import { AppHeader } from './app-header';

export function AppLayout() {
  return (
    <div className="relative">
      <AppHeader />
      <Outlet />
    </div>
  )
}