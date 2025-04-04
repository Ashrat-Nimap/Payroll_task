import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(private http: HttpClient) { }

  mytask(from: any, to: any, title: any, userId: any,isarchive : boolean,FromDate:any, ToDate:any,sortbyduedate : any,sortcolumn:any,sortorder : any): Observable<any> {
    const params = {
      From: from,
      To: to,
      Title: title,
      UserId : userId,
      IsArchive: isarchive,
      FromDueDate: FromDate,
      ToDueDate: ToDate,
      SortByDueDate: sortbyduedate,
      SortColumn: sortcolumn,
      SortOrder: sortorder
    }
    return this.http.post('api/Task/UserTasksAssignedToMe', params)
  }

  assignTask(taskdata: any): Observable<any> {
    return this.http.post('api/Task/AssignTask', taskdata)
  }
}
