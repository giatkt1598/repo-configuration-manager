import React from 'react';
import './project-item.scss';
import { Card, CardProps, IconButton, Menu, MenuItem } from '@mui/material';
import { Project } from '../models/project';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useData } from '../contexts/data.context';

export const ProjectItem = ({
  project,
  onEdit,
  onDelete,
  onClick,
  ...other
}: { project: Project, onEdit?: () => void, onDelete?: () => void, } & CardProps) => {
  const {showPopupConfirm} = useData();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Card className="project-item relative" onClick={(e) => {
        if (e.currentTarget !== e.target) return;
        onClick?.(e);
      }} {...other}>
        {project.name}
        <span className='absolute right-1 bottom-0'> 
          <IconButton onClick={handleClick}>
            <MoreHorizIcon />
          </IconButton>
        </span>
      </Card>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => {
          onEdit?.();
          handleClose();
        }}>Edit</MenuItem>
        <MenuItem onClick={() => {
          showPopupConfirm({
            message: `Are you sure to delete "${project.name}"?`,
            onConfirm: () => {
              onDelete?.();
              handleClose();
            },
            onCancel: handleClose,
          });
        }} 
        >
          <span className='text-red-500'>
            Delete
          </span>
        </MenuItem>
      </Menu>
    </>
  );
};
