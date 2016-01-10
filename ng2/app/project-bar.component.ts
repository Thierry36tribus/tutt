import {Component} from 'angular2/core';
import {Project} from './project';

@Component ({
  selector : 'project-bar',
  template: `
    <div class="project-bar row"[ngStyle]="{'background-color':project.color}">
      <span class="col-sm-10">{{project.label}}</span>
      <button (click)="edit(project)" class="btn btn-lg btn-info col-sm-1"><i class="fa fa-pencil"></i></button>
      <button (click)="startStop(project)" class="btn btn-lg btn-info col-sm-1"><i class="fa" [class.fa-play]="project.started" [class.fa-pause]="!project.started"></i></button>
    </div>
  `,
  styles: [`
    .project-bar {
      padding-left: 5px;
    }
    .project-bar button {
      margin:2px 0px 2px 0;
      height:56px;
    }
}

  `],
  inputs: ['project'],
})

export class ProjectBarComponent {

  public project: Project;

  edit (project : Project) {

  }

  startStop (project : Project) {
    project.started = !project.started
  }

}
