import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskServiceService } from '../../services/task-service.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-view-task-coverage-dialog',
  templateUrl: './view-task-coverage-dialog.component.html',
  styleUrl: './view-task-coverage-dialog.component.scss'
})
export class ViewTaskCoverageDialogComponent implements OnInit {

  statusCov : any = [];
  taskCov : any = [];
  constructor(
    public dialogRef: MatDialogRef<ViewTaskCoverageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public taskService: TaskServiceService
  ){}

  ngOnInit(){
      if(this.data){
        this.taskService.getTaskCoverage(this.data).pipe(
          map(res =>{
            if(res.Status === 200){
              this.statusCov = res.data;
              for(let i in this.statusCov){
                let val = this.statusCov[i]
                if(i === 'Not Started') i = 'Not Accepted';
                if(i === 'Pending') i = 'Partial Complete';
                this.taskCov.push({
                  'Name' : i,
                  'val' : val
                })
              }
            }
          })
        ).subscribe();
      }
  }

  onNoClick() : void {
    this.dialogRef.close();
  }


}


