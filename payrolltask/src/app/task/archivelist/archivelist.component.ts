import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { taskdatasource } from '../../datasource/taskdatasource';
import { AuthserviceService } from '../../services/authservice.service';
import { TaskServiceService } from '../../services/task-service.service';
import { DeleteEntityDialogComponent } from '../delete-entity-dialog/delete-entity-dialog.component';
import { map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-archivelist',
  templateUrl: './archivelist.component.html',
  styleUrl: './archivelist.component.scss'
})
export class ArchivelistComponent {
  dataSource! : taskdatasource;
    userId! : any;
    displayedColumns: string[] = ['Title', 'Customer Name', 'Assigned By','Assigned Date','Due Date','Priority','Status','Actions'];
    @ViewChild(MatPaginator) paginator!: MatPaginator ;
  
    constructor(private taskService : TaskServiceService,private authService : AuthserviceService,private dialog: MatDialog, private toastr: ToastrService){}
  
    ngOnInit(): void {
      this.userId = this.authService.getUserId();
      this.dataSource = new taskdatasource(this.taskService);
      this.dataSource.loadArchiveList(1,10,true,'',this.userId,[]);
    }

    ngAfterViewInit(): void {
      this.paginator.page.subscribe(() => {
        const from = (this.paginator.pageIndex * this.paginator.pageSize ) + 1;
        const to = (this.paginator.pageIndex+1) * this.paginator.pageSize;
    
        this.dataSource.loadTask(
          from,
          to,
          '',               // title
          this.userId,      // userId
          true,            // isArchive
          '', '', '', '', '', '', ''
        );
      });
    
      // Link paginator total count
      this.dataSource.paginatorCount$.subscribe(total => {
        this.paginator.length = total;
      });
    }

    unarchive(taskId : number){
        const dialogRef = this.dialog.open(DeleteEntityDialogComponent,{
          width : '200px',
          data : {
            title: 'UNARCHIVE TASK',
            message : 'Do you want to archive this Task?'
          }
        })
        dialogRef.afterClosed().subscribe(res => {
          if(!res) return 
          this.taskService.archive(taskId,false).pipe(
            map(res => {
              if(res.Status === 200){
                this.toastr.success("archived task successfully");
                this.dataSource.loadArchiveList(1,10,true,'',this.userId,[]);
              }
            })
          ).subscribe();
        })
      }
}
