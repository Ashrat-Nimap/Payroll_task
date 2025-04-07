import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { taskdatasource } from '../../datasource/taskdatasource';
import { TaskServiceService } from '../../services/task-service.service';
import { AuthserviceService } from '../../services/authservice.service';


@Component({
  selector: 'app-mytask-table',
  templateUrl: './mytask-table.component.html',
  styleUrl: './mytask-table.component.scss',
})
export class MytaskTableComponent implements OnInit{
  dataSource! : taskdatasource;
  userId! : any;
  displayedColumns: string[] = ['Title', 'Customer Name', 'Assigned By','Assigned Date','Due Date','Priority','Status'];
  @ViewChild(MatPaginator, {static : true}) paginator!: MatPaginator ;

  constructor(private taskService : TaskServiceService,private authService : AuthserviceService){}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.dataSource = new taskdatasource(this.taskService);
    this.dataSource.loadTask(1,10,'',this.userId,false,'','','','','','','')
  }

  ngAfterViewInit(): void {
    
  }
}
