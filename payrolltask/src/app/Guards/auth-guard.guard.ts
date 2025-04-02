import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = inject(AuthserviceService).isLogged();
  if(isLoggedIn){
    return true;
  }
  else{
    router.navigate(['/login']);
    return false;
  }
};
