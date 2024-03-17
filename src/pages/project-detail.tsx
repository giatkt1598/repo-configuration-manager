import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useData } from '../contexts/data.context';
import { Button, Divider, IconButton, Stack, Switch, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';
import {fs} from '../electron-ts';
import { CommonHelper } from '../utilities/common-helper';
import { Project, RepoConfigVariant } from '../models';
import { ProjectService } from '../services/project.service';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { child_process } from '../electron-ts';
import CircleIcon from '@mui/icons-material/Circle';

export const ProjectDetailPage = () => {
  const projectId = useParams().id;
  const { setHeader, project, setProject, getProjectById, showPopupConfirm } = useData();
  const [currentApplyVariantId, setCurrentApplyVariantId] = useState<string | undefined>('');
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    if (projectId) {
      const p = getProjectById(projectId);
      if (p) {
        setHeader(p?.name);
        initDefaultConfigs(p);
      }
    }
  }, [projectId]);

  useEffect(() => {
    checkCurrentApplyVariant();
  }, [project]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    getProjectById(projectId!);
  };

  const initDefaultConfigs = (project: Project) => {
    if (!project || project.configVariants?.length > 0) return;
    
    project.configVariants ??= [];
    const configVariant: RepoConfigVariant = {
      isDefault: true,
      id: CommonHelper.newId(),
      name: 'Default',
      values: [],
    };
    project.configs.forEach(({filePath, id}) => {
      const path = project.directory + filePath;
      if (!fs.existsSync(path)) return;
      const config = fs.readFileSync(path).toString();
      configVariant.values.push({
        id: CommonHelper.newId(),
        repoConfigId: id,
        value: config,
      });
    });
    project.configVariants.push(configVariant);

    setProject(project);
  }

  function handleSave() {
    ProjectService.update(project!);
    getProjectById(projectId!);
    checkCurrentApplyVariant();
    toast('Save successful!', {type:'success', position: 'bottom-right'});
  }

  function deleteConfigVariant() {
    if (!project) return;
    if (project.configVariants.length < 2) {
      alert('Project must has at least 1 config');
      return;
    }

    showPopupConfirm({
      onConfirm() {
        setActiveTab(0);
        setProject(p => {
          const item = p?.configVariants[activeTab];
          if (item?.isDefault) {
                p!.configVariants[0].isDefault = true;
          }
          
          p!.configVariants.splice(activeTab, 1);
          return {...p!};
        });
    
        handleSave();
      },
    })
  }

  function addConfigVariant() {
    if (!project) return;

    let startLength = project.configVariants.length + 1;
    const lastName = project.configVariants[project.configVariants.length - 1].name;
    if (lastName.match(/\([0-9]+\)$/)?.[0]) {
      startLength = +lastName.match(/\([0-9]+\)$/)![0].replace('(', '').replace(')', '') + 1;
    }
    
    const configVariant: RepoConfigVariant = {
      isDefault: false,
      id: CommonHelper.newId(),
      name: `Config (${startLength})`,
      values: [],
    };
    project.configs.forEach(({filePath, id}) => {
      const path = project.directory + filePath;
      if (!fs.existsSync(path)) return;
      const config = fs.readFileSync(path).toString();
      configVariant.values.push({
        id: CommonHelper.newId(),
        repoConfigId: id,
        value: config,
      });
    });
    project.configVariants.push(configVariant);
    setProject({...project});
    ProjectService.update(project!);
  }

  function applyConfigVariant() {
    let isValid = true;
    project?.configVariants[activeTab].values.forEach((config) => {
      const fileConfigRelativePath = project.configs.find(x => x.id === config.repoConfigId)?.filePath;
      const path = project.directory + (fileConfigRelativePath || '');

      if (!fileConfigRelativePath || !fs.existsSync(path)) {
        isValid = false;
        return;
      }
    });

    if (!isValid) {
      alert('Not found file config');
      return;
    }

    project?.configVariants[activeTab].values.forEach((config) => {
      const fileConfigRelativePath = project.configs.find(x => x.id === config.repoConfigId)?.filePath;
      const path = project.directory + (fileConfigRelativePath || '');

      fs.writeFileSync(path, config.value);
    });
    checkCurrentApplyVariant();
    CommonHelper.showSuccess(`Apply config "${project?.configVariants[activeTab].name}" for "${project?.name}"`);
  }

  function discardChange() {
    const paths: string[] = [];
    project?.configVariants[activeTab].values.forEach((config) => {
      const fileConfigRelativePath = project.configs.find(x => x.id === config.repoConfigId)?.filePath;
      const path = project.directory + (fileConfigRelativePath || '');
      paths.push(path);
    });

    child_process.exec(`cd ${project!.directory} && git restore ${paths.map(f => `"${f}"`).join(' ')}`, (error: any) => {
      if (error) {
        alert(error);
      } else {
        checkCurrentApplyVariant();
        CommonHelper.showSuccess(`Discard change config for "${project!.name}" is successful.`);
      }
    });
  }

  function checkCurrentApplyVariant() {
    if (!project?.configVariants?.length) return;

    project?.configVariants.forEach((variant) => {
      const isApply = variant.values.every((config) => {
        const fileConfigRelativePath = project.configs.find(x => x.id === config.repoConfigId)?.filePath;
        const path = project.directory + (fileConfigRelativePath || '');
        if (fileConfigRelativePath && fs.existsSync(path)) {
          const currentConfig = fs.readFileSync(path).toString();
          return config.value.trim().replace(/\s/gmi, '') === currentConfig.trim().replace(/\s/gmi, '');
        }
        return false;
      });

      if (isApply) {
        setCurrentApplyVariantId(variant.id);
        return;
      }
    });
  }
  
  if (!project) return <div />;

  

  return (
    <div>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={activeTab + ''}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" variant='scrollable' scrollButtons='auto'>
              {project.configVariants?.map((variant, idx) => (
                <Tab key={variant.id} label={
                  <span>
                    {variant.name}
                    {variant.id === currentApplyVariantId && <CircleIcon className='text-green-500 ml-1' style={{width: 8, height: 8}}/>}
                  </span>
                } value={idx + ''} />
              ))}
            </TabList>
            <IconButton title='Add' className='w-10' onClick={addConfigVariant}>
              <AddIcon />
            </IconButton>
          </Box>

          {project.configVariants?.map((variant, idx) => (
            <TabPanel key={variant.id} value={idx + ''}>
              <Stack spacing={2} direction={'row'} className='mt-2'>
                <TextField sx={{width: 300}} variant='outlined' 
                  defaultValue={project.configVariants[activeTab]?.name} 
                  label='Name'
                  onChange={(e) => {
                    setProject(p => {
                      p!.configVariants[activeTab].name = e.target.value;
                      return {...p!};
                    });
                  }}
                />

                <Stack direction={'row'} alignItems={'center'} spacing={1}>
                  <input id='isDefault' type='checkbox' defaultChecked={project.configVariants[activeTab].isDefault} onChange={(e) => {
                    setProject(p => {
                      p!.configVariants[activeTab].isDefault = e.target.checked;

                      e.target.checked && p?.configVariants.filter((_, idx) => idx !== activeTab).forEach(item => item.isDefault = false);                
                      return {...p!};
                    });
                  }}/>
                  <label htmlFor='isDefault'>
                  Is Default
                  </label>

                </Stack>
                <div className='flex-1'/>
                <IconButton onClick={deleteConfigVariant}>
                  <DeleteIcon className='text-red-500' />
                </IconButton>
                <Button variant='outlined' onClick={discardChange}>Discard Changes</Button>
                <Button variant='outlined' onClick={handleSave}>Save</Button>
                <Button variant='contained' onClick={applyConfigVariant}>Apply</Button>
              </Stack>
              <div className='m-3'>
                <Divider/>
              </div>
              <Stack direction={'column'} spacing={2}>
                {
                  variant.values.map((val) => (
                    <Stack key={val.id} direction={'column'}>
                      <div className='font-bold'>{project.configs.find(x => x.id=== val.repoConfigId)?.filePath}</div>
                      <TextField multiline maxRows={15} defaultValue={val.value} onChange={e => {
                        val.value = e.target.value
                      }} />
                    </Stack>

                  ))
                }
              </Stack>
              <br />

            </TabPanel>
          ))}
         
        </TabContext>
      </Box>
    </div>
  )
}