import {Component, OnInit} from 'angular2/core';
import {NgStyle} from 'angular2/common';
import {RouteConfig} from 'angular2/router';
import {Project} from './project';
import {ProjectBarComponent} from './project-bar.component';
import {ProjectService} from './project.service';
import 'rxjs/add/operator/map';

@Component({
    template: `
      <div [style.display]="loading ? 'block' : 'none'">Chargement en cours</div>
      <ul class="projects">
        <li *ngFor="#project of projects" >
          <project-bar [project]="project" [navigate]="true"></project-bar>
        </li>
      </ul>
    `,
    styles: [`
      .projects {
        list-style: none;
      }
    `],
    directives: [ProjectBarComponent],
    providers: [ProjectService],
})
export class ProjectsComponent implements OnInit {
  public projects : Project[];
  public loading;

  constructor(
    private _projectService: ProjectService) { }

  getProjects() {
    this.loading = true;
    this._projectService.getProjects().subscribe(
      projects => this.projects = projects,
      err=>console.log('error during GET projects: ' + err),
      ()=> this.loading=false);
  }
  ngOnInit() {
    this.getProjects();
  }
}
