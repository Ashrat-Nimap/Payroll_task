import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MytaskTableComponent } from './mytask-table/mytask-table.component';
import { CcComponent } from './cc/cc.component';
import { AssigntomeComponent } from './assigntome/assigntome.component';
import { ArchivelistComponent } from './archivelist/archivelist.component';
import { MytaskComponent } from './mytask/mytask.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMenuModule} from '@angular/material/menu';
import {FormsModule} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { DeleteEntityDialogComponent } from './delete-entity-dialog/delete-entity-dialog.component';
import { MatDialogContent, MatDialogActions,MatDialogTitle } from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewTaskCoverageDialogComponent } from './view-task-coverage-dialog/view-task-coverage-dialog.component';
import { AddMemberDialogComponent } from './add-member-dialog/add-member-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


const routes : Routes =[
  {
    path : '',
    component : MytaskComponent
  }
]

@NgModule({
  declarations: [
    MytaskTableComponent,
    CcComponent,
    AssigntomeComponent,
    ArchivelistComponent,
    MytaskComponent,
    AddTaskDialogComponent,
    DeleteEntityDialogComponent,
    ViewTaskCoverageDialogComponent,
    AddMemberDialogComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes)
  ],
  providers : [],
  exports: [RouterModule]
})
export class TaskModule { }
