import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/app-layout';
import { ProjectPage } from './pages/project';
import { LINK_PROJECT, LINK_PROJECT_DETAIL } from './constants/app-link';
import { ProjectDetailPage } from './pages/project-detail';
function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path={'/'} element={<AppLayout />}>
          <Route path={LINK_PROJECT} element={<ProjectPage />} />
          <Route path={LINK_PROJECT_DETAIL} element={<ProjectDetailPage />} />
        </Route>
      </Routes>

    </HashRouter>
  );
}

export default App;
