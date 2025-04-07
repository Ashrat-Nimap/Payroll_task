import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  constructor(private http : HttpClient) { }

  login(
    username:any,
    password:any
  ) : Observable<any>{
    return this.http.post('api/Account/authenticate',{username,password})
  }

  // logout() : Observable<any>{
  //    return this.http.post('api/Account/Logout')
  // }

  isLogged(){
    return sessionStorage.getItem("token") !== null;
  }

  getTokenByUserId() : any{
    const token = localStorage.getItem('referraltoken'); // Or use directly if you have it
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (err) {
      console.error('Token decoding failed:', err);
      return null;
    }
  }

  getUserId() : string | null{
    const token = this.getTokenByUserId();
    return token?.UserId ?? null;
  }

  getToken(): string | null {
    return sessionStorage.getItem("token");
  }

  getUsername() {
    return sessionStorage.getItem("username");
  }
}
