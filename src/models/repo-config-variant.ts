import { BaseModel } from './base-model';
import { RepoConfigValue } from './repo-config-value';

export interface RepoConfigVariant extends BaseModel {
  name: string;
  isDefault: boolean;
  values: RepoConfigValue[];
}
