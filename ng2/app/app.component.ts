import {Component, OnInit} from 'angular2/core';
import {NgStyle} from 'angular2/common';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Project} from './project';
import {ProjectsComponent} from './projects.component';
import {ProjectComponent} from './project.component';
import {ProjectBarComponent} from './project-bar.component';
import {ProjectService} from './project.service';
import 'rxjs/add/operator/map';

@RouteConfig([
  {path:'/projects',    name: 'Projects',  component: ProjectsComponent},
  {path:'/project/:id', name: 'Project',   component: ProjectComponent}
])
@Component({
    selector: 'tutt-app',
    template: `
      <h1>The new Tutt is coming...</h1>
       <a [routerLink]="['Projects']">Projects</a>
      <router-outlet></router-outlet>
    `,
    styles: [`
    `],
    directives: [ProjectBarComponent, ROUTER_DIRECTIVES],
    providers: [ProjectService],
})
export class AppComponent {}
