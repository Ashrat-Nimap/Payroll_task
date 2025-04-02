import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(private http : HttpClient) { }

  mytask(from : any,to : any, title : any) : Observable<any>{
    const params = {
      From : from,
      To : to,
      Title : title
    }
    return this.http.post('api/Task/UserTasksAssignedToMe',params)
  }
}
