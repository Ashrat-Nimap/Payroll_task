import { Component, Inject } from '@angular/core';
import { AuthserviceService } from '../../services/authservice.service';
import { Observable } from 'rxjs';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mytask',
  templateUrl: './mytask.component.html',
  styleUrl: './mytask.component.scss'
})
export class MytaskComponent {
  Username: any

  constructor(
    private authService: AuthserviceService,
    private dialog: MatDialog,
    private router : Router
  ){}

  ngOnInit(): void {
    this.Username = this.authService.getUsername(); 
  }

  opentaskdialog(){
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      height : '500px',
      width: '1100px',
      panelClass: 'dialog-container'
    });
  }

  signout(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
 
}
