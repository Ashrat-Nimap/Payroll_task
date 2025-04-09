import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { taskdatasource } from '../../datasource/taskdatasource';
import { AuthserviceService } from '../../services/authservice.service';
import { TaskServiceService } from '../../services/task-service.service';

@Component({
  selector: 'app-cc',
  templateUrl: './cc.component.html',
  styleUrl: './cc.component.scss'
})
export class CcComponent implements OnInit{
  dataSource! : taskdatasource;
    userId! : any;
    displayedColumns: string[] = ['Title', 'Customer Name', 'Assigned By','Assigned Date','Due Date','Priority','Status'];
    @ViewChild(MatPaginator) paginator!: MatPaginator ;
  
    constructor(private taskService : TaskServiceService,private authService : AuthserviceService){}

    ngOnInit(): void {
      this.userId = this.authService.getUserId();
      this.dataSource = new taskdatasource(this.taskService);
      this.dataSource.loadCC(1,10,'','','','','',[])
    }

    ngAfterViewInit(): void {
      this.paginator.page.subscribe(() => {
        const from = (this.paginator.pageIndex * this.paginator.pageSize ) + 1;
        const to = (this.paginator.pageIndex+1) * this.paginator.pageSize;
    
        this.dataSource.loadCC(
          from,
          to,
          '',               // title
          '',      // userId
          '',            // isArchive
          '', '', '',
        );
      });
    
      // Link paginator total count
      this.dataSource.paginatorCount$.subscribe(total => {
        this.paginator.length = total;
      });
    }
}
