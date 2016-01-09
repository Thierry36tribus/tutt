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
      <ul class="projects">
        <li *ngFor="#project of projects" >
          <project-bar [project]="project"></project-bar>
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
export class AppComponent implements OnInit {
  public projects : Project[];

  constructor(private _projectService: ProjectService) { }

  getProjects() {
    this._projectService.getProjects().subscribe(
      projects => this.projects = projects,
      err=>console.log('error: ' + err),
      ()=>console.log('done'));
  }
  ngOnInit() {
    this.getProjects();
  }
}
