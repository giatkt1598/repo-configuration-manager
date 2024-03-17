import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/app-layout';
import { ProjectPage } from './pages/project';
import { DataProvider } from './contexts/data.context';
import { LINK_PROJECT, LINK_PROJECT_DETAIL } from './constants/app-link';
import { ProjectDetailPage } from './pages/project-detail';
import { ToastContainer } from 'react-toastify';
function App() {

  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<AppLayout />}>
            <Route path={LINK_PROJECT} element={<ProjectPage />} />
            <Route path={LINK_PROJECT_DETAIL} element={<ProjectDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </DataProvider>
  );
}

export default App;
