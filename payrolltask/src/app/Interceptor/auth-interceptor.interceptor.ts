import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthserviceService);
  const token = authService.getToken();
  if(token){
    req = req.clone({
      setHeaders : {
        Authorization : `Bearer ${token}`
      }
    })
  }
  return next(req);
};
