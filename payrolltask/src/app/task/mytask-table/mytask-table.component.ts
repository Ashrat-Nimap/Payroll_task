import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { taskdatasource } from '../../datasource/taskdatasource';
import { TaskServiceService } from '../../services/task-service.service';
import { AuthserviceService } from '../../services/authservice.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteEntityDialogComponent } from '../delete-entity-dialog/delete-entity-dialog.component';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-mytask-table',
  templateUrl: './mytask-table.component.html',
  styleUrl: './mytask-table.component.scss',
})
export class MytaskTableComponent implements OnInit{
  dataSource! : taskdatasource;
  userId! : any;
  displayedColumns: string[] = ['Title', 'Customer Name', 'Assigned By','Assigned Date','Due Date','Priority','Status','Actions'];
  @ViewChild(MatPaginator, {static : true}) paginator!: MatPaginator ;

  constructor(private taskService : TaskServiceService,private authService : AuthserviceService,private dialog: MatDialog,private toastr : ToastrService){}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.dataSource = new taskdatasource(this.taskService);
    this.dataSource.loadTask(1,10,'',this.userId,false,'','','','','','','')
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      const from = (this.paginator.pageIndex * this.paginator.pageSize ) + 1;
      const to = (this.paginator.pageIndex+1) * this.paginator.pageSize;
  
      this.dataSource.loadTask(
        from,
        to,
        '',               
        this.userId,      
        false,           
        '', '', '', '', '', '', ''
      );
    });
  
    this.dataSource.paginatorCount$.subscribe(total => {
      this.paginator.length = total;
    });
  }

  deleteTask(taskId : number){
    const dialogRef = this.dialog.open(DeleteEntityDialogComponent,{
      width : '200px',
      data : {
        title: 'DELETE TASK',
        message : 'Are sure you want to delete this task ?'
      }
    })
    dialogRef.afterClosed().subscribe(res =>{
      if(!res) return;
      this.taskService.deleteTask(taskId).pipe(
        map(res => {
          if(res.Status === 200){
            this.toastr.success("Task Deleted Successfully");
            this.dataSource.loadTask(1,10,'',this.userId,false,'','','','','','','')
          }
        })
      ).subscribe();
    })
  }

  archive(taskId : number){
    const dialogRef = this.dialog.open(DeleteEntityDialogComponent,{
      width : '200px',
      data : {
        title: 'ARCHIVE TASK',
        message : 'Do you want to archive this Task?'
      }
    })
    dialogRef.afterClosed().subscribe(res => {
      if(!res) return 
      this.taskService.archive(taskId,true).pipe(
        map(res => {
          if(res.Status === 200){
            this.toastr.success("archived task successfully");
            this.dataSource.loadTask(1,10,'',this.userId,false,'','','','','','','')
          }
        })
      ).subscribe();
    })
  }
  
}
