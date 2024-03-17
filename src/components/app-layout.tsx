import { Outlet } from 'react-router-dom';
import { AppHeader } from './app-header';
import { ToastContainer } from 'react-toastify';
import { DataProvider } from '../contexts/data.context';

export function AppLayout() {
  return (
    <DataProvider>
      <div className="relative">
        <AppHeader />
        <Outlet />
        <ToastContainer />
      </div>
    </DataProvider>
  )
}