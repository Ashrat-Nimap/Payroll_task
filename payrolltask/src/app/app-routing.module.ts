import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MytaskComponent } from './task/mytask/mytask.component';
import { authGuardGuard } from './Guards/auth-guard.guard';


const routes: Routes = [
  {
    path : "login",
    component : LoginComponent
  },
  {
    path : "mytask",
    loadChildren : ()=> import('./task/task.module').then(m => m.TaskModule),
    canActivate : [authGuardGuard]
  },
  {
    path : '',
    redirectTo : "/login",
    pathMatch : 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
