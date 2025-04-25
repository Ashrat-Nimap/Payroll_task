import { Component, Inject } from '@angular/core';
import { AuthserviceService } from '../../services/authservice.service';
import { Observable } from 'rxjs';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-mytask',
  templateUrl: './mytask.component.html',
  styleUrl: './mytask.component.scss'
})
export class MytaskComponent {
  Username: any
  taskAdded: boolean = false;
  selectedTab: number = 0;
  tabIndex: any;

  constructor(
    private authService: AuthserviceService,
    private dialog: MatDialog,
    private router : Router
  ){}

  ngOnInit(): void {
    this.Username = this.authService.getUsername(); 
  }

  opentaskdialog(){
    const params = {
      Action : 'Add',
      SelectedIndex: this.selectedTab
    }
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '1200px',
      panelClass: 'dialog-container',
      data: params
    });

    dialogRef.afterClosed().subscribe(
      res =>{
        
      }
    )
  }

  onTabChanged(event: any): void {
    // this.searchInput.nativeElement.value = '';
    this.selectedTab = event.index;
  }

  signout(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
 
}
