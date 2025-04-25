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

  isLogged(){
    return (typeof window !== 'undefined' && !!sessionStorage.getItem("token") !== null);
  }

  getTokenByUserId() : any{
    const token = sessionStorage.getItem('referraltoken'); 
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (err) {
      console.error('Token decoding failed:', err);
      return null;
    }
  }

  getUserId() : number | null{
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
