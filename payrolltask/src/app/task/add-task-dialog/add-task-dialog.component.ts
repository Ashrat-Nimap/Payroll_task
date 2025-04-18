import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskServiceService } from '../../services/task-service.service';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthserviceService } from '../../services/authservice.service';
import { DatePipe } from '@angular/common';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { debug } from 'node:console';


@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss',
  providers: [DatePipe]
})
export class AddTaskDialogComponent implements OnInit {
  @ViewChild('imageFileInput') imageFileInput!: ElementRef<HTMLInputElement>;
  addtaskform: any = FormGroup
  selectedIndex: number = 0;
  UserId!: any;
  currentDate = new Date()
  leadlist: any;
  newlist : any = []
  memberlist: any;
  fileName: string = ''
  filteredLeadList: any; 
  filterMemberList : any;
  displayfilename : string = '';
  imageName : string = '';
  imageExt : string = '';
  from = 1;
  to = 10;
  text = '';
  leaddata = {
    From : 1,
    To : -1,
    Text : ''
  }
  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private taskService: TaskServiceService,
    private toastr: ToastrService,
    private authService: AuthserviceService,
    private datepipe: DatePipe
  ) { 
    this.selectedIndex = data.SelectedIndex ?? 0;
  }

  ngOnInit(): void {
    this.UserId = Number(this.authService.getUserId());
    this.getLeadList();
    this.getMemberList(this.from, this.text, this.to);
    this.forminit();
    if (this.data?.action === 'edit' && this.data.task) {
      this.patchFormValue(this.data.task);
    }
  }

  forminit() {
    this.addtaskform = this.fb.group({
      AssignedBy: [this.UserId],
      AssignedToUserId: [''],
      AssignedDate: [''],
      Title: ['', [Validators.required, Validators.pattern("^[a-z A-Z]+$")]],
      Description: [''],
      Image: [''],
      LeadId: [''],
      MultimediaData : [''],
      MultimediaExtension : [''],
      MultimediaFileName : [''],
      MultimediaType : [''],
      TaskEndDateDisplay: ['',Validators.required],
      TaskEndDate: ['',Validators.required],
      Priority: [''],
      UserIds: [''],
      TaskOwners: ['']
    })
  }

  patchFormValue(task: any){
    this.addtaskform.patchValue({
      AssignedBy: task.AssignedBy || this.UserId,
      Title: task.Title,
      Description: task.Description,
      Image: task.Image,
      LeadId: task.LeadId,
      MultimediaData: task.MultimediaData,
      MultimediaExtension: task.MultimediaExtension,
      MultimediaFileName: task.MultimediaFileName,
      MultimediaType: task.MultimediaType,
      TaskEndDateDisplay: task.TaskEndDateDisplay || new Date(task.TaskEndDate),
      TaskEndDate: task.TaskEndDate,
      Priority: task.Priority,
      UserIds: task.AssignedToUserIds,
      TaskOwners: task.TaskOwnerIds,
    });
  
    this.fileName = task.Image || '';
    this.selectedIndex = this.data.SelectedIndex || 0;
  }
  getLeadList() {
    this.taskService.getLead(this.leaddata).pipe(
      map((res : any) => {
        this.leadlist = res.data.Leads;
        this.filteredLeadList = this.leadlist;
      })
    ).subscribe();
  }

  getMemberList(from : any,text : any,to : any) {
    
    this.taskService.getMemberList(from,text,to).pipe(
      map((res : any) =>{
        const newMembers = res.data.Members || [];
      if (this.memberlist && this.memberlist.length) {
        this.memberlist = [...this.memberlist, ...newMembers];
      } else {
        this.memberlist = newMembers;
      }

      this.filterMemberList = this.memberlist;
      })
    ).subscribe()
  }

  onSelectOpened(opened: boolean) {
    if (opened) {
      setTimeout(() => {
        const panel = document.querySelector('.mat-select-panel');
        if (panel) {
          panel.addEventListener('scroll', this.onScroll.bind(this));
        }
      }, 100);
    }
  }

  onScroll(event: any) {
    const el = event.target;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 1) {
      this.from = this.to;
      this.to = this.to + 10;
      this.getMemberList(this.from, this.text, this.to);
    }
  }


  triggerFileSelect(event?: Event): void {
    if (!event) {
      this.imageFileInput.nativeElement.click();
      return;
    }

    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (file.size < 2000000) {
        this.displayfilename = file.name;
        this.imageName = file.name.split('\\').pop()?.split('/').pop() ?? '';
        const extMatch = this.imageName.split('.').pop();
        this.imageExt = extMatch ?? '';
        this.imageName = this.imageName.replace(`.${this.imageExt}`, '');

        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = btoa(e.target.result);
          this.addtaskform.patchValue({
            Image: base64String,
            MultimediaData: base64String,
            MultimediaExtension: this.imageExt,
            MultimediaFileName: this.imageName,
            MultimediaType: file.type,
          });
        };
        reader.readAsBinaryString(file);
      } else {
        this.toastr.error('File size is greater than 2MB');
      }
    }
  }

  removeFile(): void {
    this.imageFileInput.nativeElement.value = '';
    this.displayfilename = '';

    this.addtaskform.patchValue({
      Image: '',
      MultimediaData: '',
      MultimediaExtension: '',
      MultimediaFileName: '',
      MultimediaType: '',
    });
  }
  
  // triggerFileInput(event: MouseEvent) {
  //   event.preventDefault();
  //   const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.click();
  //   }
  // }

  tabChange() {
   this.forminit()
  }

  // onSubmit() {
  //   if (this.addtaskform.valid) {
  //     const controls = this.addtaskform.controls;
  //     const taskEndDate = this.addtaskform.get('TaskEndDateDisplay')?.value;
  //     const formattedDate = this.datepipe.transform(
  //       taskEndDate,
  //       'd MMM yyyy hh:mm a'
  //     );

  //     this.addtaskform.patchValue({
  //       TaskEndDate: formattedDate
  //     });

  //     if (this.selectedIndex === 0) {
        
  //       this.taskService.assignTask(this.addtaskform.value).pipe(
  //         map((res) => {
  //           if (res) {
  //             this.toastr.success("Task Added SuccessFully");
  //           } else {
  //             this.toastr.error("Something Went Wrong");
  //           }
  //         }
  //         )
  //       ).subscribe();
  //     } else if (this.selectedIndex === 1) {
  //       this.addtaskform.get('UserIds')?.setValue([this.UserId]);
  //       this.taskService.assignTask(this.addtaskform.value).pipe(
  //         map((res) => {
  //           if (res) {
  //             this.toastr.success("Task Added SuccessFully");
  //           } else {
  //             this.toastr.error("Something Went Wrong");
  //           }
  //         }
  //         )
  //       ).subscribe();
  //     }
  //   }
  // }

  onSubmit() {
    if (this.addtaskform.valid) {
      const taskEndDate = this.addtaskform.get('TaskEndDateDisplay')?.value;
      const formattedDate = this.datepipe.transform(taskEndDate, 'd MMM yyyy hh:mm a');
  
      this.addtaskform.patchValue({ TaskEndDate: formattedDate });
  
      // Check for Edit
      if (this.data?.action === 'edit' && this.data.task?.TaskId) {
        const updatedTask = {
          TaskId: this.data.task.TaskId,
          ...this.addtaskform.value
        };
  
        this.taskService.updateTask(updatedTask).pipe(
          map((res) => {
            if (res) {
              this.toastr.success("Task Updated Successfully");
              this.dialogRef.close(true);
            } else {
              this.toastr.error("Update Failed");
            }
          })
        ).subscribe();
      } else {
        // ADD NEW
        if (this.selectedIndex === 0) {
          this.taskService.assignTask(this.addtaskform.value).pipe(
            map((res) => {
              if (res) {
                this.toastr.success("Task Added Successfully");
                this.dialogRef.close(true);
              } else {
                this.toastr.error("Add Failed");
              }
            })
          ).subscribe();
        } else if (this.selectedIndex === 1) {
          this.addtaskform.get('UserIds')?.setValue([this.UserId]);
          this.taskService.assignTask(this.addtaskform.value).pipe(
            map((res) => {
              if (res) {
                this.toastr.success("Task Added Successfully");
                this.dialogRef.close(true);
              } else {
                this.toastr.error("Add Failed");
              }
            })
          ).subscribe();
        }
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  searchLead(searchText: any) {
    if (searchText && searchText.trim() !== '') {
      this.filteredLeadList = this.leadlist.filter((lead: any) =>
        lead.LeadName?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      this.filteredLeadList = this.leadlist;
    }
  }

  searchMemeber(searchText: any) {
    if (searchText && searchText.trim() !== '') {
      this.filterMemberList = this.memberlist.filter((member: any) =>
        member.Name?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      this.filterMemberList = this.memberlist;
    }
  }
}
