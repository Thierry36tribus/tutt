import {Component, OnInit} from 'angular2/core';
import {NgStyle} from 'angular2/common';
import {Project} from './project';
import {ProjectBarComponent} from './project-bar.component';
import {ProjectService} from './project.service';
import 'rxjs/add/operator/map';


@Component({
    selector: 'tutt-app',
    template: `
      <h1>The new Tutt is coming...</h1>
      <div [style.display]="loading ? 'block' : 'none'">Chargement en cours</div>
      <ul class="projects">
        <li *ngFor="#project of projects" >
          <project-bar [project]="project"></project-bar>
        </li>
      </ul>
    `,
    styles: [`
      .projects {
        list-style: none;
        height:60px;
        line-height:60px;
      }
    `],
    directives: [ProjectBarComponent],
    providers: [ProjectService],
})
export class AppComponent implements OnInit {
  public projects : Project[];
  public loading;

  constructor(private _projectService: ProjectService) { }

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
