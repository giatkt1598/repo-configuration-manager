import { Project } from '../models';
import { CommonHelper } from '../utilities/common-helper';

export class ProjectService {
  private static readonly TABLE = 'Project';
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
    const str = localStorage.getItem(this.TABLE);
    return str ? (JSON.parse(str) as Project[]) : [];
  }

  static getById(id: string) {
    return this.getList().find((x) => x.id === id);
  }

  private static setList(projects: Project[]) {
    localStorage.setItem(this.TABLE, JSON.stringify(projects));
  }
}
