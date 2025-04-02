import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  constructor(private http : HttpClient) { }

  login(data:Partial<{
    username:any,
    password:any
  }>) : Observable<any>{
    return this.http.post('api/Account/authenticate',data)
  }

  logout() : Observable<any>{
     return this.http.delete('api/Account/Logout')
  }

  isLogged(){
    return sessionStorage.getItem("token") !== null;
  }

  getToken(): string | null {
    return sessionStorage.getItem("token");
  }

  getUsername() {
    return sessionStorage.getItem("username");
  }
}
