import { BaseModel } from './base-model';

export interface RepoConfigValue extends BaseModel {
  repoConfigId: string;
  value: string;
}