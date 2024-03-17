import { Box, Button, Modal, Stack, Typography } from '@mui/material';

export interface ConfirmPopupProps {
    title?: string;
    message?: string;
    open: boolean;
    setOpen: (isOpen: boolean) => void;
    onConfirm?: () => void;
    onCancel?: () => void;
}
export function ConfirmPopup({
  message,
  title,
  open,
  setOpen,
  onCancel,
  onConfirm,
}: ConfirmPopupProps) {
  const handleClose = () => setOpen(false);
  
  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        onCancel?.();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {message}
        </Typography>

        <Stack direction={'row'} spacing={2} className='mt-4' justifyContent={'end'}>
          <Button variant='contained' onClick={() => {
            onConfirm?.();
            handleClose();
          }}>Confirm</Button>
          <Button variant='outlined' onClick={() => {
            onCancel?.();
            handleClose();
          }}>Cancel</Button>

        </Stack>
      </Box>
    </Modal>
  )
}


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
