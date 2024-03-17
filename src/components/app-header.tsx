import { IconButton } from '@mui/material';
import { useData } from '../contexts/data.context';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
export function AppHeader() {
  const navigate = useNavigate();
  const { header } = useData();
  return (<div className="flex sticky shadow-lg bg-white top-0 w-full z-50 px-2 min-h-10">
    <div className="flex-1 flex items-center font-bold">
      {header}
    </div>
    {
      window.location.pathname !== '/' &&
            <IconButton onClick={() => navigate('/', {replace: true,})}>
              <ArrowForwardIosIcon />
            </IconButton>
    }
  </div>)
}