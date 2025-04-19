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
  newlist: any = []
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
    private taskService: TaskServiceService,
    private toastr: ToastrService,
    private authService: AuthserviceService,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.UserId = Number(this.authService.getUserId());
    this.getLeadList();
    this.getMemberList(this.from, this.text, this.to);
    this.forminit();
    if (this.data.action === 'edit') {
      this.taskService.getTaskDetails(this.data.UserId).subscribe(res => {
        this.taskdetailslist = res.data;
        const userIds = this.taskdetailslist.AssignedToUserIds || [];
        const currentUserId = this.UserId;

        if (!userIds.includes(currentUserId) && userIds.length > 1) {
          this.selectedIndex = 0;
          this.tabdisable = true;
        } else {
          this.selectedIndex = 1;
          this.tabdisable = false;
        }
        this.patchFormValue();
      });
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
      Id: [''],
      LeadId: [''],
      MultimediaData: [''],
      MultimediaExtension: [''],
      MultimediaFileName: [''],
      MultimediaType: [''],
      TaskEndDateDisplay: ['', Validators.required],
      TaskEndDate: [''],
      Priority: [''],
      UserIds: [''],
      TaskOwners: ['']
    })
  }

  patchFormValue() {
    debugger
    this.addtaskform.patchValue(this.taskdetailslist);
    this.addtaskform.get('TaskEndDateDisplay').setValue(
      new Date(this.taskdetailslist.TaskEndDate).toISOString()
    )
    this.addtaskform.get('Id')?.setValue(this.taskdetailslist.TaskId)
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

  getMemberList(from: any, text: any, to: any) {
    this.taskService.getMemberList(from, text, to).pipe(
      map((res: any) => {
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

  tabChange() {
    this.forminit()
  }

  onSubmit() {
    if (this.addtaskform.valid) {
      const taskEndDate = this.addtaskform.get('TaskEndDateDisplay')?.value;
      const formattedDate = this.datepipe.transform(taskEndDate, 'd MMM yyyy hh:mm a');

      this.addtaskform.patchValue({ TaskEndDate: formattedDate });

      // Check for Edit
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
      if (this.data?.action === 'edit' && this.taskdetailslist?.TaskId) {
        const updatedTask = {
          TaskId: this.taskdetailslist.TaskId,
          ...this.addtaskform.value
        };

        this.taskService.updateTask(updatedTask).pipe(
          map((res) => {
            if (res) {
              this.dialogRef.close(true);
            } else {
              this.toastr.error("Update Failed");
            }
          })
        ).subscribe();
      } else {
        // ADD NEW
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
