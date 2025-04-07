import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskServiceService } from '../../services/task-service.service';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthserviceService } from '../../services/authservice.service';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss'
})
export class AddTaskDialogComponent implements OnInit {
  addtaskform: any = FormGroup
  selectedIndex: number = 0;
  UserId!: any;
  leadlist : any
  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private taskService: TaskServiceService,
    private toastr: ToastrService,
    private authService: AuthserviceService
  ) { }

  ngOnInit(): void {
    this.UserId = this.authService.getUserId();
    this.getLeadList();
    this.forminit();
  }

  forminit() {
    this.addtaskform = this.fb.group({
      AssignedBy: [this.UserId],
      Title: ['', Validators.required],
      Description: [''],
      Image: [''],
      LeadId: [''],
      TaskEndDateDisplay: [''],
      Priority: [''],
      UserIds: [''],
      TaskOwners: ['']
    })
  }

  getLeadList(){
    this.taskService.getLead().subscribe((res) =>{
      this.leadlist = res.data.Leads
    })
  }

  onSubmit() {
    if (this.selectedIndex === 0) {
      this.taskService.assignTask(this.addtaskform.value).pipe(
        map((res) => {
          if (res) {
            this.toastr.success("Task Added SuccessFully");
          } else {
            this.toastr.error("Something Went Wrong");
          }
        }
        )
      ).subscribe();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
