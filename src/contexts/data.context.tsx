import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ProjectService } from '../services/project.service';
import { Project } from '../models';
import { ConfirmPopup, ConfirmPopupProps } from '../components/confirm-popup';
import { useLocation, useNavigate } from 'react-router-dom';

interface DataState {
  projects: Project[];
  getProjects: () => void;
  header?: ReactNode;
  setHeader: (header: ReactNode) => void;
  project?: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | undefined>>;
  getProjectById: (id: string) => Project | undefined;
  showPopupConfirm: (option: ShowPopupConfirmOption) => void;
}

const initialState: DataState = {
  projects: [],
  getProjects: () => {},
  setHeader: () => {},
  setProject: () => {},
  getProjectById: () => undefined,
  showPopupConfirm: () => {},
};
const DataContext = createContext(initialState);

const useData = () => useContext(DataContext);

const DataProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [header, setHeader] = useState<ReactNode>(null);
  const [project, setProject] = useState<Project>();
  const [openPopup, setOpenPopup] = useState(false);
  const [popup, setPopup] = useState<ConfirmPopupProps>({
    open: false,
    setOpen: () => {},
  });

  useEffect(() => {
    const currentPath = window.localStorage.getItem('CURRENT_PATH');
    if (currentPath && currentPath !== '/') {
      navigate(currentPath);
    }

  }, []);
  
  useEffect(() => {
    window.localStorage.setItem('CURRENT_PATH', location.pathname);
  }, [location]);

  const getProjects = () => {
    setProjects(ProjectService.getList());
  };

  const getById = (id: string) => {
    const p = ProjectService.getById(id);
    setProject(p);
    return p;
  };

  const showPopupConfirm = (option: ShowPopupConfirmOption) => {
    setOpenPopup(true);
    setPopup({
      message: option.message || 'Are you confirm?',
      title: option.title || 'Confirm',
      open: true,
      setOpen: setOpenPopup,
      onConfirm: option.onConfirm,
      onCancel: option.onCancel,
    });
  }

  return (
    <DataContext.Provider
      value={{
        projects,
        getProjects,
        header,
        setHeader,
        setProject,
        project,
        getProjectById: getById,
        showPopupConfirm,
      }}
    >
      {children}

      <ConfirmPopup
        {...popup}
        open={openPopup}
      ></ConfirmPopup>
    </DataContext.Provider>
  );
};

export { DataProvider, useData };

interface ShowPopupConfirmOption {
    title?: string;
    message?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}