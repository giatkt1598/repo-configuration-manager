import { Button, IconButton, Stack, TextField } from '@mui/material'
import { dialog } from '../electron-ts'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { ProjectService } from '../services/project.service'
import { useData } from '../contexts/data.context'
import { Project } from '../models'
import AddIcon from '@mui/icons-material/Add';
import { CommonHelper } from '../utilities/common-helper'
import DeleteIcon from '@mui/icons-material/Delete';

export const AddProject = (props: { onClose: () => void }) => {
  const { getProjects, project } = useData();
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger
  } = useForm<Project>({values: project});

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'configs', // unique name for your Field Array
  });

  const selectProjectFolder = () => {
    dialog.showOpenDialog({ properties: ['openDirectory'] }).then((val) => {
      const dir = val.filePaths?.[0];
      if (!dir) return;

      let projectName = getValues().name;

      if (dir) {
        projectName = dir.substring(dir.lastIndexOf('\\') + 1, dir.length);
      }
      setValue('directory', dir);
      setValue('name', projectName);
      trigger('directory');
      trigger('name');
    });
  }

  const selectConfigFile = (index: number) => {
    if (!getValues().directory) {
      alert('Please select Project Director before!');
      return;
    }
    dialog.showOpenDialog({ properties: ['openFile'], defaultPath: getValues().directory }).then((val) => {
      const dir = val.filePaths?.[0];
      if (!dir) return;
      
      const projectDir = getValues().directory!;
      if (!dir.startsWith(projectDir)) {
        alert('Cannot select file config outside of project');
        return;
      }
      setValue(`configs.${index}.filePath`, dir.replace(projectDir, ''));
      trigger(`configs.${index}.filePath`);
    });
  }

  const onSubmit: SubmitHandler<Project> = (data) => {
    if (data.id) {
      ProjectService.update(data);
    } else {
      ProjectService.insert(data);
    }
    getProjects();
    props.onClose();
  }


  return (
    <div className='p-4' style={{ minWidth: 800 }}>
      <Stack
        component="form"
        spacing={2}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className='font-bold underline pb-4'>{project?.id ? 'Edit project': 'Add new project'}</h1>
        <Stack direction={'row'} spacing={2}>
          <TextField
            required
            className='flex-1'
            label="Select project folder"
            hiddenLabel
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            {...register('directory', { required: true })}
          />
          <Button variant='outlined' onClick={selectProjectFolder}>Browser</Button>
        </Stack>

        <TextField
          label="Project Name"
          hiddenLabel
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          required
          {...register('name', { required: true })}
        />

        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <span>File configs</span>
          <IconButton onClick={() => {
            append({filePath: '',id: CommonHelper.newId()});
          }}>
            <AddIcon />
          </IconButton>
        </Stack>

        {
          fields.map((config, idx) => (
            <Stack key={idx} direction={'row'} spacing={2}>
              <TextField
                required
                className='flex-1'
                label={'File config ' + (idx + 1)}
                hiddenLabel
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                {...register(`configs.${idx}.filePath`, {required: true})}
              />
              <Button variant='outlined' onClick={() => selectConfigFile(idx)}>Browser</Button>
              <IconButton onClick={() => {
                remove(idx);
              }}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))
        }

        <Button variant='contained' type='submit' size='large'>
          {project?.id ? 'Save' : 'Add Project'}
        </Button>
      </Stack>
    </div>
  )
}
