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
    AddTaskDialogComponent
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
    RouterModule.forChild(routes)
  ],
  providers : [provideNativeDateAdapter()],
  exports: [RouterModule]
})
export class TaskModule { }
