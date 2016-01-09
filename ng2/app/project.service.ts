import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import {Project} from './project';

@Injectable()
export class ProjectService {
  constructor(private _http: Http) {}
  getProjects() {
    return this._http.get('/projects').map(response => response.json());
  }
}
