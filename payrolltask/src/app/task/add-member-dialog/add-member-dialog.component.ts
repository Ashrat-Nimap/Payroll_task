import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil, map } from 'rxjs';
import { TaskServiceService } from '../../services/task-service.service';

@Component({
  selector: 'app-add-member-dialog',
  templateUrl: './add-member-dialog.component.html',
  styleUrl: './add-member-dialog.component.scss'
})
export class AddMemberDialogComponent {
  memberList: any[] = [];
  userIds: any[] = [];
  removeUserList: any[] = [];
  removeUserDetails: any;

  totalRecords = 0;
  lastRowIndex = 0;
  previousFromRow = 1;
  previousToRow = 10;
  viewLoading = false;
  noRecords = false;

  showRemoveUser = false;
  addRemove = false;

  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskServiceService,
    public dialogRef: MatDialogRef<AddMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    const { usersData, usersIds } = this.data;

    if (usersData) {
      this.showRemoveUser = true;
      this.removeUserDetails = usersData;
      this.getMembersList(1, 100, '');
    } else if (usersIds?.length > 0) {
      this.addRemove = true;
      this.getMembersList(1, 100, '');
    } else {
      this.getMembersList(1, 10, '');
    }
  }

  getMembersList(from: number,to: number,search: string): void {
    this.viewLoading = true;
    this.taskService.getMemberList(from,to,search)
      .pipe(
        takeUntil(this.destroy$),
        map(res => res.data)
      )
      .subscribe(data => {
        this.memberList.push(...data.Members);
        this.totalRecords = data.TotalRecords;
        this.lastRowIndex = this.memberList.length;
        this.viewLoading = false;
        this.getChecked();
      });
  }

  onscroll(event: any): void {
    const { scrollTop, offsetHeight, scrollHeight } = event.target;
    const isAtBottom = scrollTop + offsetHeight >= scrollHeight;

    if (isAtBottom && this.lastRowIndex < this.totalRecords) {
      this.previousFromRow += 10;
      this.previousToRow += 10;
      this.getMembersList(this.previousFromRow, this.previousToRow, '');
    }
  }

  searchMember(search: string): void {
    this.viewLoading = true;
    this.taskService.getMemberList(1, this.totalRecords, search)
      .pipe(
        takeUntil(this.destroy$),
        map(res => res.data)
      )
      .subscribe(data => {
        this.memberList = data.Members || [];
        this.noRecords = this.memberList.length === 0;
        this.viewLoading = false;
      });
  }

  checkedMember(event: any, userId: number, memberName: string): void {
    if (event.checked) {
      if (this.showRemoveUser) {
        this.removeUserList.push(this.data.Action === 'Owner' ? { UserId: userId } : userId);
      } else {
        this.userIds.push({ UserId: userId, Name: memberName });
      }
    } else {
      if (this.showRemoveUser) {
        this.removeUserList = this.removeUserList.filter(u => u !== userId && u?.UserId !== userId);
      } else {
        this.userIds = this.userIds.filter(u => u.UserId !== userId);
      }
    }
  }

  onSubmit(): void {
    if (this.showRemoveUser) {
      const removeFn = this.data.Action === 'Owner'
        ? this.taskService.removeOwnerTask(this.data.taskId, this.removeUserList)
        : this.taskService.removeUsersExistingTask(this.data.taskId, this.removeUserList);

      removeFn.pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.Status === 200) this.dialogRef.close({ isEdit: true });
      });
    } else {
      this.dialogRef.close({ members: this.userIds, isEdit: true });
    }
  }

  getChecked(): void {
    const { controlname, usersIds } = this.data;
    if (!usersIds) return;

    this.userIds = [];

    this.memberList.forEach(member => {
      if (
        (controlname === 'UserIds' && usersIds.includes(member.UserId)) ||
        (controlname === 'TaskOwner' && usersIds.some((u: any) => u.UserId === member.UserId))
      ) {
        member.isChecked = true;
        this.userIds.push({ UserId: member.UserId, Name: member.Name });
      }
    });

    if (controlname === 'TaskOwner') {
      this.userIds = [...usersIds];
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
