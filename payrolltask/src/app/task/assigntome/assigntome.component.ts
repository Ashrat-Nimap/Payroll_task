import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { taskdatasource } from '../../datasource/taskdatasource';
import { AuthserviceService } from '../../services/authservice.service';
import { TaskServiceService } from '../../services/task-service.service';
import { map } from 'rxjs';
import { DeleteEntityDialogComponent } from '../delete-entity-dialog/delete-entity-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assigntome',
  templateUrl: './assigntome.component.html',
  styleUrl: './assigntome.component.scss'
})
export class AssigntomeComponent {
  dataSource!: taskdatasource;
  userId!: any;
  displayedColumns: string[] = ['Title', 'Customer Name', 'Assigned By', 'Assigned Date', 'Due Date', 'Priority', 'Status','Actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private taskService: TaskServiceService, private authService: AuthserviceService, private dialog: MatDialog, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.dataSource = new taskdatasource(this.taskService);
    this.dataSource.loadAssingByMeTask(1, 10, '', '', false, [], '', '', '', '')
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      const from = (this.paginator.pageIndex * this.paginator.pageSize) + 1;
      const to = (this.paginator.pageIndex + 1) * this.paginator.pageSize;

      this.dataSource.loadTask(
        from,
        to,
        '',               // title
        this.userId,      // userId
        false,            // isArchive
        '', '', '', '', '', '', ''
      );
    });

    // Link paginator total count
    this.dataSource.paginatorCount$.subscribe(total => {
      this.paginator.length = total;
    });
  }

  deleteTask(taskId: number) {
    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, {
      width: '200px',
      data : {
        title: 'DELETE TASK',
        message : 'Are sure you want to delete this task ?'
      }
    })
    dialogRef.afterClosed().subscribe(res => {
      if (!res) return;
      this.taskService.deleteTask(taskId).pipe(
        map(res => {
          if (res.Status === 200) {
            this.toastr.success("Task Delete Successfully");
            this.dataSource.loadAssingByMeTask(1, 10, '', '', false, [], '', '', '', '')
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
            this.dataSource.loadAssingByMeTask(1, 10, '', '', false, [], '', '', '', '')
          }
        })
      ).subscribe();
    })
  }

}
