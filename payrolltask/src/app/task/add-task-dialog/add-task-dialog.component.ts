import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskServiceService } from '../../services/task-service.service';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthserviceService } from '../../services/authservice.service';
import { DatePipe } from '@angular/common';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss',
  providers : [DatePipe]
})
export class AddTaskDialogComponent implements OnInit {
  addtaskform: any = FormGroup
  selectedIndex: number = 0;
  UserId!: any;
  currentDate = new Date()
  leadlist : any;
  memberlist : any;
  fileName : string = ''
  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private taskService: TaskServiceService,
    private toastr: ToastrService,
    private authService: AuthserviceService,
    private datepipe : DatePipe
  ) { }

  ngOnInit(): void {
    this.UserId = this.authService.getUserId();
    this.getLeadList();
    this.getMemberList();
    this.forminit();
  }

  forminit() {
    this.addtaskform = this.fb.group({
      AssignedBy: [this.UserId],
      Title: ['', Validators.required],
      Description: [''],
      Image: [''],
      LeadId: [''],
      TaskEndDateDisplay : [''],
      TaskEndDate: [''],
      Priority: [''],
      UserIds: [[]],
      TaskOwners: [[]]
    })
  }

  getLeadList(){
    this.taskService.getLead().subscribe((res) =>{
      this.leadlist = res.data.Leads
    })
  }

  getMemberList(){
    this.taskService.getMemberList().subscribe((memlist)=>{
      this.memberlist = memlist.data.Members
    })
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      this.fileName = file.name
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
  
        image.onload = () => {
          this.addtaskform.patchValue({
            Image: e.target.result, 
          });
          // if (image.width <= 310 && image.height <= 325) {
          //   this.imageError = ''; 

           
          //   this.previewImage = e.target.result; 
          // } else {
          //   this.imageError = 'Image must be between 310 and 325 pixels only';
          //   this.registrationform.patchValue({
          //     image: null,
          //   });
          //   this.previewImage = null; 
          // }
        };
      };
  
      reader.readAsDataURL(file); 
    } else {
      console.log('No file selected');
    }
  }

  triggerFileInput(event: MouseEvent) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;

    if(event.index === 0){
      this.addtaskform.reset();
      this.addtaskform.patchValue({
        AssignedBy: this.UserId,
      });
    } else if (event.index === 1) {
      this.addtaskform.reset();
      this.addtaskform.patchValue({
        AssignedBy: this.UserId,
      }); 
    }
  }

  onSubmit() {
    const controls = this.addtaskform;

    const formattedDate = this.datepipe.transform(
      controls.get('TaskEndDateDisplay')?.value,
      'd MMM yyyy hh:mm a'
    );

    this.addtaskform.patchValue({
      TaskEndDate: formattedDate
    });

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
    }else if(this.selectedIndex === 1){
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
