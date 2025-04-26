import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TaskServiceService } from '../../services/task-service.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthserviceService } from '../../services/authservice.service';
import { DatePipe } from '@angular/common';
import { AddMemberDialogComponent } from '../add-member-dialog/add-member-dialog.component';



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
  newlist: any = [];
  taskOwners: any = [];
  userIds: any = [];
  memberLength: number = 0;
  userLength: number = 0;
  taskOwnerCount: number = 0;
  assignedToCount: number = 0;
  userDetails: any;
  memberlist: any;
  indexOfTab: any;
  taskdetailslist: any;
  tabdisable: boolean = false
  fileName: string = ''
  filteredLeadList: any;
  filterMemberList: any;
  displayfilename: string = '';
  imageName: string = '';
  imageExt: string = '';
  from = 1;
  to = 100;
  text = '';
  leaddata = {
    From: 1,
    To: -1,
    Text: ''
  }
  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private taskService: TaskServiceService,
    private toastr: ToastrService,
    private authService: AuthserviceService,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.UserId = Number(this.authService.getUserId());
    this.forminit();
    this.getLeadList();
    if (this.data.Action !== 'Add') {
      this.patchFormValue();
    }
  }

  forminit() {
    this.addtaskform = this.fb.group({
      AssignedBy: [this.UserId],
      AssignedToUserId: [''],
      AssignedDate: [''],
      Title: ['', [Validators.required, Validators.pattern("^[a-z A-Z]+$")]],
      Description: ['',Validators.required],
      Image: [''],
      Id: [''],
      LeadId: [''],
      MultimediaData: [''],
      MultimediaExtension: [''],
      MultimediaFileName: [''],
      MultimediaType: [''],
      TaskEndDateDisplay: ['',Validators.required],
      TaskEndDate: [''],
      UserDisplayIds: [''],
      Priority: [''],
      UserIds: [[]],
      TaskOwners: [[]],
      TaskDisplayOwners: [''],
    })
  }

  patchFormValue() {
    const controls = this.addtaskform.controls;
    this.selectedIndex = this.data.selectedIndex ?? 0;
    this.tabdisable = this.data.tabDisable ?? false;
    this.taskdetailslist = this.data.taskDetails;

    this.addtaskform.patchValue(this.taskdetailslist);
    controls['Id'].setValue(this.taskdetailslist.TaskId);
    controls['TaskEndDateDisplay'].setValue(
      new Date(this.taskdetailslist.TaskEndDate).toISOString()
    )
    this.taskOwners = this.taskdetailslist.TaskOwnerIds || [];
    this.taskOwnerCount = this.taskdetailslist.TaskOwnerCount || 0;
    this.userIds = this.taskdetailslist.AssignedToUserIds || [];
    this.assignedToCount = this.taskdetailslist.AssignedToUserCount || 0;

    controls['TaskDisplayOwners'].setValue(
      this.taskOwnerCount > 1 ? `${this.taskOwnerCount} Users` : `${this.taskOwnerCount} User`
    )

    controls['UserDisplayIds'].setValue(
      this.assignedToCount > 1 ? `${this.assignedToCount} Users` : `${this.assignedToCount} User`
    )

    this.imageName = /[^/]*$/.exec(this.taskdetailslist.MultimediaName)?.[0] || '';
    this.imageExt = /[^.]*$/.exec(this.taskdetailslist.MultimediaName)?.[0] || '';
    if (this.imageExt === 'pdf' ||
      this.imageExt === 'doc' ||
      this.imageExt === 'docx' ||
      this.imageExt === 'xls' ||
      this.imageExt === 'xlsx' ||
      this.imageExt === 'txt' ||
      this.imageExt === 'jpeg' ||
      this.imageExt === 'jpg' ||
      this.imageExt === 'png' ||
      this.imageExt === 'svg') {
      this.displayfilename = this.imageName
    }
  }

  getLeadList() {
    this.taskService.getLead(this.leaddata).pipe(
      map((res: any) => {
        this.leadlist = res.data.Leads;
        this.filteredLeadList = this.leadlist;
      })
    ).subscribe();
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
        reader.readAsDataURL(file);
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

  tabChange() {
    this.forminit()
  }

  onSubmit() {
    if(this.addtaskform.invalid){
      this.addtaskform.markAllAsTouched();
      return
    }
    if (this.addtaskform.valid) {
      const controls = this.addtaskform.controls;
      const taskEndDate = this.addtaskform.get('TaskEndDateDisplay')?.value;
      const formattedDate = this.datepipe.transform(taskEndDate, 'd MMM yyyy hh:mm a');
      this.addtaskform.patchValue({ TaskEndDate: formattedDate });
      const ext = this.imageExt?.toLowerCase();
      const multimediaTypeControl = this.addtaskform.get('MultimediaType');

      if (multimediaTypeControl) {
        if (['jpeg', 'jpg', 'png', 'svg'].includes(ext)) {
          multimediaTypeControl.setValue('I');
        } else if (ext) {
          multimediaTypeControl.setValue('D');
        } else {
          multimediaTypeControl.setValue('');
        }
      }
      if (this.data?.Action === 'edit') {
        controls['TaskOwners'].setValue(this.taskOwners);
        if(this.selectedIndex === 1){
          controls['UserDisplayIds'].disable();
          this.userIds = [];
          this.userIds.push(this.data.UserId);
          controls['UserIds'].setValue(this.userIds);
        }

        if (this.selectedIndex === 0) {
          controls['UserDisplayIds'].updateValueAndValidity();
          controls['UserDisplayIds'].setValue(this.userIds);
        }
        this.taskService.updateTask(this.addtaskform.value).pipe(
          map(res => {
            if (res.Status === 200) {
              this.dialogRef.close({res, isEdit: false})
            }
          })
        ).subscribe();
        
      } else {
        controls['TaskOwners'].setValue(this.taskOwners);
        const ext = this.imageExt?.toLowerCase();
        const multimediaTypeControl = this.addtaskform.get('MultimediaType');

        if (multimediaTypeControl) {
          if (['jpeg', 'jpg', 'png', 'svg'].includes(ext)) {
            multimediaTypeControl.setValue('I');
          } else if (ext) {
            multimediaTypeControl.setValue('D');
          } else {
            multimediaTypeControl.setValue('');
          }
        }
        if (this.selectedIndex === 0) {
          controls['UserIds'].setValue(this.userIds)
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

  openMembers(controlName: any): void {
    const controls = this.addtaskform.controls;
  
    const isUserIds = controlName === 'UserIds';
    const formControl = isUserIds ? controls.UserDisplayIds : controls.TaskDisplayOwners;
  
    if (isUserIds) {
      formControl.clearValidators();
      formControl.updateValueAndValidity();
    }
  
    const params = {
      usersIds: isUserIds ? this.userIds : this.taskOwners,
      controlname: isUserIds ? 'UserIds' : 'TaskOwner',
      Action: this.data.Action,
    };
  
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: params,
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) return;
  
      const selectedMembers = res.members || [];
  
      if (isUserIds) {
        this.userIds = [];
        this.assignedToCount = 0;
        selectedMembers.forEach((result: any) => {
          if (!this.userIds.includes(result.UserId)) {
            this.userIds.push(result.UserId);
            this.assignedToCount += 1;
          }
        });
        this.userLength = this.userIds.length;
        formControl.setValue(`${this.userLength} User${this.userLength > 1 ? 's' : ''}`);
  
        if (this.data.Action === 'edit') {
          this.taskService.addUsersExistingTask(this.data.UserId, this.userIds)
            .pipe(map((res) => {
              if (res.Status === 200) {
                this.toastr.success('User Updated Successfully');
              }
            }))
            .subscribe();
        }
  
      } else {
        this.taskOwners = [];
        this.taskOwnerCount = 0;
        selectedMembers.forEach((result: any) => {
          if (!this.taskOwners.includes(result)) {
            this.taskOwnerCount += 1;
            this.taskOwners.push(result);
          }
        });
        this.memberLength = this.taskOwners.length;
        formControl.setValue(`${this.memberLength} User${this.memberLength > 1 ? 's' : ''}`);
  
        if (this.data.Action === 'edit') {
          this.taskService.updateOwnerList(this.data.UserId, this.taskOwners)
            .pipe(map((res) => {
              if (res.Status === 200) {
                this.taskOwners = res.data.TaskOwnerIds;
                this.toastr.success('User Updated Successfully');
              }
            }))
            .subscribe();
        }
      }
    });
  }

  removeOwners(user: string): void {
    const isOwner = user === 'Owner';
  
    const params = {
      usersData: isOwner ? this.taskOwners : this.userIds,
      taskId: this.data.UserId,
      Action: isOwner ? 'Owner' : 'User',
    };
  
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: params,
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) return;
      this.taskService.getTaskDetails(this.data.UserId).subscribe(
        (res : any) =>{
          if(isOwner){
            this.taskOwners = res.data.TaskOwnerIds || [];
            this.taskOwnerCount = this.taskOwners.length;
            this.addtaskform.controls['TaskDisplayOwners'].setValue(
              this.taskOwnerCount > 1 ? `${this.taskOwnerCount} Users` : `${this.taskOwnerCount} User`
            )
          } else {
            this.userIds = res.data.AssignedToUserIds || [];
            this.assignedToCount = this.userIds.length;
            this.addtaskform.controls['UserDisplayIds'].setValue(
              this.assignedToCount > 1 ? `${this.assignedToCount} Users` : `${this.assignedToCount} User`
            )
          }
        }
      )
      this.toastr.success('User Updated Successfully');
      this.ngOnInit();
    });
  }
  
}