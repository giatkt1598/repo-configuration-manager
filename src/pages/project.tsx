import Box from '@mui/material/Box';
import { ProjectItem } from '../components/project-item';
import { Card, Fab, Modal, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './project.scss';
import { useEffect, useState } from 'react';
import { AddProject } from '../components/add-project';
import { useData } from '../contexts/data.context';
import { useNavigate } from 'react-router-dom';
import { LINK_PROJECT_DETAIL } from '../constants/app-link';
import { ProjectService } from '../services/project.service';

export function ProjectPage() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const { projects, getProjects, setHeader ,setProject} = useData();
  useEffect(() => {
    setHeader('Projects');
    getProjects();
  }, []);

  return (
    <div className="relative w-full project-page">
      <Box sx={{ width: '100%', typography: 'body1' }} className="flex p-3 gap-3 flex-wrap justify-center items-center">
        {
          projects.map((item) => <ProjectItem key={item.id} project={item} onClick={() => {
            setProject(undefined);
            navigate(LINK_PROJECT_DETAIL.replace(':id', item.id));
          }} onEdit={() => {
            setProject(item);
            setShowAddModal(true);
          }} onDelete={(() => {
            ProjectService.delete(item.id);
            getProjects();
          })} />)
        }
      </Box>
      {projects.length < 1 && <Typography variant='h6' className='text-center'>List project is empty!</Typography>}
      <Fab color="primary" aria-label="add" className="btn-add" onClick={() => {
        setProject(undefined);
        setShowAddModal(true);
      }}>
        <AddIcon />
      </Fab>

      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex justify-center items-center"
      >
        <Card className="p-4">
          <AddProject onClose={() => setShowAddModal(false)} />
        </Card>
      </Modal>
    </div>
  )
}