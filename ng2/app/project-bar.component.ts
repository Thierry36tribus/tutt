import {Component} from 'angular2/core';
import {Project} from './project';

@Component ({
  selector : 'project-bar',
  template: `
    <div [ngStyle]="{'background-color':project.color}">
      {{project.label}}
    </div>
  `,
  inputs: ['project'],
})

export class ProjectBarComponent {

  public project: Project;

}
