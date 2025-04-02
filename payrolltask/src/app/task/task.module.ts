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
    MytaskComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TaskModule { }
