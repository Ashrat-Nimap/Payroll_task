import { Component, Inject } from '@angular/core';
import { AuthserviceService } from '../../services/authservice.service';
import { Observable } from 'rxjs';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';

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
 
}
