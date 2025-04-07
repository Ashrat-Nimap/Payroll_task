import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { taskdatasource } from '../../datasource/taskdatasource';
import { AuthserviceService } from '../../services/authservice.service';
import { TaskServiceService } from '../../services/task-service.service';

@Component({
  selector: 'app-archivelist',
  templateUrl: './archivelist.component.html',
  styleUrl: './archivelist.component.scss'
})
export class ArchivelistComponent {
  dataSource! : taskdatasource;
    userId! : any;
    displayedColumns: string[] = ['Title', 'Customer Name', 'Assigned By','Assigned Date','Due Date','Priority','Status'];
    @ViewChild(MatPaginator) paginator!: MatPaginator ;
  
    constructor(private taskService : TaskServiceService,private authService : AuthserviceService){}
  
    ngOnInit(): void {
      this.userId = this.authService.getUserId();
      this.dataSource = new taskdatasource(this.taskService);
      this.dataSource.loadArchiveList(1,10,true,'',this.userId,[]);
    }
}
