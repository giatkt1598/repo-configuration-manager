import { useEffect, useState } from 'react';
import './App.scss';
import { app, dialog } from './electron-ts';
import { Button } from '@mui/material';

function App() {
  const [currentRAM, setCurrentRAM] = useState('');
  useEffect(() => {
    const ramInterval = setInterval(() => {
      const ramInfo = process.getSystemMemoryInfo();
      setCurrentRAM(~~(ramInfo.free / ramInfo.total * 100) + '%');
    }, 1000);
    return () => {
      clearInterval(ramInterval);
    }
  }, []);

  const openFile = () => {
    dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
  }
  return (
    <div className="App">
      AppPath: {app.getAppPath()}
      <br />
      RAM free: {currentRAM}
      <br />
      <Button variant="outlined" onClick={openFile}>Open file</Button>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Button variant='contained'>click me</Button>
    </div>
  );
}

export default App;
