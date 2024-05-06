import { app, fs } from '../electron-ts';
import { Project } from '../models';
import { CommonHelper } from '../utilities/common-helper';

export class ProjectService {
  private static readonly TABLE = 'Project';
  private static readonly DATA_FOLDER = `${app.getPath('appData')}\\repo-configuration-manager`;
  private static readonly DATA_FILE = `${this.DATA_FOLDER}\\data.json`;

  static insert(project: Project) {
    const projects = this.getList();
    project.id = CommonHelper.newId();
    projects.push(project);
    this.setList(projects);
  }

  static update(project: Project) {
    const projects = this.getList();
    const entity = projects.find((x) => x.id === project.id);
    if (!entity) throw new Error('Not found entity');
    Object.assign(entity, project);
    this.setList(projects);
  }

  static delete(id: string) {
    const projects = this.getList().filter((x) => x.id !== id);
    this.setList(projects);
  }

  static getList() {
    const dataFromFile = this.loadFromUserData();
    if (dataFromFile.length > 0) return dataFromFile;

    const str = localStorage.getItem(this.TABLE);
    return str ? (JSON.parse(str) as Project[]) : [];
  }

  static getById(id: string) {
    return this.getList().find((x) => x.id === id);
  }

  private static setList(projects: Project[]) {
    localStorage.setItem(this.TABLE, JSON.stringify(projects));
    this.saveToUserData(JSON.stringify(projects, null, 4) || '[]');
  }

  static saveToUserData(data: string) {
    if (!fs.existsSync(this.DATA_FOLDER)) {
      fs.mkdirSync(this.DATA_FOLDER);
    }
    localStorage.setItem('APP_DATA_PATH', this.DATA_FOLDER);
    fs.writeFileSync(this.DATA_FILE, data);
  }

  static loadFromUserData(): Project[] {
    if (!fs.existsSync(this.DATA_FILE)) {
      return [];
    }

    try {
      return JSON.parse(fs.readFileSync(this.DATA_FILE).toString() || '[]');
    } catch (error) {
      return [];
    }
  }
}
