import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';
import { LoaderService } from '../services/loader.service';
import { finalize } from 'rxjs';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthserviceService);
  const loader = inject(LoaderService);
  const token = authService.getToken();
  if(token){
    req = req.clone({
      setHeaders : {
        Authorization : `Basic ${token}`
      }
    })
  }

  const isLoginRequest = req.url.includes('api/Account/authenticate'); // <-- Adjust based on your actual login URL

  if (!isLoginRequest) {
    loader.show();
  }

  loader.show();

  return next(req).pipe(
    finalize(() =>{
      if (!isLoginRequest) {
        loader.hide();
      }
    })
  );
};
