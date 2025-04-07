import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(private http: HttpClient) { }

  mytask(from: any, to: any, title: any, userId: any,isarchive : boolean, userIds : any,FromDate:any, ToDate:any, StatusIds : any,sortbyduedate : any,sortcolumn:any,sortorder : any): Observable<any> {
    const params = {
      From: from,
      To: to,
      Title: title,
      UserId : userId,
      IsArchive: isarchive,
      UserIds : userIds,
      FromDueDate: FromDate,
      TaskStatus: StatusIds,
      ToDueDate: ToDate,
      SortByDueDate: sortbyduedate,
      SortColumn: sortcolumn,
      SortOrder: sortorder
    }
    return this.http.post('api/Task/UserTasksAssignedToMe', params)
  }

  cc(from : any,to:any,title : any,userId : any,isarchive : boolean,StatusIds : any,priority : any,userIds : any) : Observable<any>{
    const params = {
      From: from,
      To: to,
      Title: title,
      UserId : userId,
      IsArchive: isarchive,
      TaskStatus: StatusIds,
      UserIds : userIds,
      Priority : priority
    }
    return this.http.post('api/Task/OwnerTasks',params)
  }

  assignByMeTask(from: any, to: any, title: any, userId: any,isarchive : boolean, userIds : any,FromDate:any, ToDate:any, StatusIds : any,sortbyduedate : any): Observable<any> {
    const params = {
      From: from,
      To: to,
      Title: title,
      UserId : userId,
      IsArchive: isarchive,
      UserIds : userIds,
      FromDueDate: FromDate,
      TaskStatus: StatusIds,
      ToDueDate: ToDate,
      SortByDueDate: sortbyduedate,
    }
    return this.http.post('api/Task/UserTasksAssignedByMe', params)
  }

  archiveList(from : any,to : any,isarchive : boolean,title: string,userId : any,userIds : any) : Observable<any>{
    const params = {
      From : from,
      To: to,
      IsArchive: isarchive,
      Title : title,
      UserId : userId,
      UserIds : userIds
    }
    return this.http.post('api/Task/UserTasksAssignedByMe', params)
  }

  getLead() : Observable<any>{
    const params = {
      From : 1,
      To : -1,
      Text : ''
    }
    return this.http.post('api/CRM/Leads',params)
  }

  assignTask(taskdata: any): Observable<any> {
    return this.http.post('api/Task/AssignTask', taskdata)
  }
}
