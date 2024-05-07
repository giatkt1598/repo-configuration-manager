import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import LoopIcon from '@mui/icons-material/Loop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ProjectDetailMoreButton(props: {
    onSave?: () => void,
    onResetToCurrent?: () => void,
    onDiscardChanges?: () => void,
    onDelete?: () => void,
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (func?: () => void) => {
    func?.();
    handleClose();
  }
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon/>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
          sx: {minWidth: 200}
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick(props.onSave)}>
          <ListItemIcon>
            <CheckCircleIcon />
          </ListItemIcon>
          <ListItemText>
          Save
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuItemClick(props.onResetToCurrent)}>
          <ListItemIcon>
            <LoopIcon />
          </ListItemIcon>
          <ListItemText>
          Reset to current
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(props.onDiscardChanges)}>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText>
            Discard changes
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleMenuItemClick(props.onDelete)} style={{color: 'red'}}>
          <ListItemIcon>
            <DeleteIcon className='text-red-500' fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
