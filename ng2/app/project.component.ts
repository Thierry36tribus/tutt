import {Component, OnInit} from 'angular2/core';
import {NgStyle} from 'angular2/common';
import {RouteParams} from 'angular2/router';
import {Project} from './project';
import {ProjectBarComponent} from './project-bar.component';
import {ProjectService} from './project.service';
import 'rxjs/add/operator/map';

@Component({
    template: `
      <h1>Project page...</h1>
      <div [style.display]="loading ? 'block' : 'none'">Chargement en cours</div>
      <project-bar [project]="project"></project-bar>
    `,
    styles: [`
    `],
    directives: [ProjectBarComponent],
    providers: [ProjectService],
})
export class ProjectComponent implements OnInit {
  public project : Project;
  public loading;

  constructor(private _projectService: ProjectService,private _routeParams : RouteParams) { }
  getProject(id:string) {
    this.loading = true;
    this._projectService.getProject(id).subscribe(
      project => {
        this.project = project;
        console.log('project:' + JSON.stringify(project));
      },
      err=>console.log('error during GET project: ' + err),
      ()=> this.loading=false);
  }
  ngOnInit() {
    let id = this._routeParams.get('id')
    console.log('id:' + id)
    this.getProject(id);
  }
}
