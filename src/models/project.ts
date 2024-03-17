import { BaseModel } from './base-model';
import { RepoConfig } from './repo-config';
import { RepoConfigVariant } from './repo-config-variant';

export interface Project extends BaseModel {
  name?: string;
  directory?: string;
  configs: RepoConfig[];
  configVariants: RepoConfigVariant[];
}
