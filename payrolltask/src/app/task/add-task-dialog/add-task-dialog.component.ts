import { Component, Inject, OnInit } from '@angular/core';
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
  }

  forminit() {
    this.addtaskform = this.fb.group({
      AssignedBy: [this.UserId],
      Title: ['', [Validators.required, Validators.pattern("^[a-z A-Z]+$")]],
      Description: [''],
      Image: [''],
      LeadId: [''],
      MultimediaData : [''],
      MultimediaExtension : [''],
      MultimediaFileName : [''],
      MultimediaType : [''],
      TaskEndDateDisplay: [''],
      TaskEndDate: [''],
      Priority: [''],
      UserIds: [''],
      TaskOwners: ['']
    })
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
            Image: this.fileName,
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

  tabChange() {
   this.forminit()
  }

  onSubmit() {
    if (this.addtaskform.valid) {
      const controls = this.addtaskform.controls;
      const taskEndDate = this.addtaskform.get('TaskEndDateDisplay')?.value;
      const formattedDate = this.datepipe.transform(
        taskEndDate,
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
      } else if (this.selectedIndex === 1) {
        this.addtaskform.get('UserIds')?.setValue([this.UserId]);
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
