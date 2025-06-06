import { Component } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';
import { FormControl, FormControlName, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterServiceService } from '../services/toaster-service.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isloading : boolean = false;
  hide : boolean= true;
  constructor(private authService : AuthserviceService,private router : Router,private toastr : ToasterServiceService){}
  loginfrom = new FormGroup({
    username : new FormControl(),
    password : new FormControl()
  })

  
  onlogin(){
    this.isloading = true;
    const {username , password} = this.loginfrom.value;
    this.authService.login(username,password)
    .subscribe({
      next : (res) => {
        if(res.success === true){
          this.isloading = false
          this.router.navigate(['/mytask']);
          sessionStorage.setItem("token",btoa(`${username}`+ ':' + `${password}`));
          sessionStorage.setItem("username",res.userDetail?.data?.Name);
          sessionStorage.setItem("referraltoken",res.referralToken);
          this.toastr.showSuccess("Login Successfull");
        }else{
          this.toastr.showError(res.errormessage);
          this.isloading = false
        }
      },
      error : (err) =>{
        this.toastr.showError("Something went wrong");
      }
    })
  }
  showpass(){
    
  }
}