import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {Project} from './project';

@Component ({
  selector : 'project-bar',
  template: `
    <div *ngIf="project" class="project-bar row"[ngStyle]="{'background-color':project.color}">
      <span (click)="navTo(project)" class="col-sm-10">{{project.label}}</span>
      <button (click)="edit(project)" class="btn btn-lg btn-info col-sm-1"><i class="fa fa-pencil"></i></button>
      <button (click)="startStop(project)" class="btn btn-lg btn-info col-sm-1"><i class="fa" [class.fa-play]="!project.started" [class.fa-stop]="project.started"></i></button>
    </div>
  `,
  styles: [`
    .project-bar {
      padding-left: 5px;
      height:60px;
      line-height:60px;
    }
    .project-bar button {
      margin:2px 0px 2px 0;
      height:56px;
    }
}

  `],
  inputs: ['project','navigate'],
})

export class ProjectBarComponent {

  public project: Project;
  public navigate: boolean;

  constructor(private _router : Router){}

  navTo(project : Project){
    if (this.navigate) {
      this._router.navigate(['Project', {id : project.id}])
    }
  }

  edit (project : Project) {

  }

  startStop (project : Project) {
    project.started = !project.started
  }

}
