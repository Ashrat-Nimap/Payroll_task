import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss'
})
export class AddTaskDialogComponent implements OnInit{
  addtaskform : any = FormGroup
   constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb : FormBuilder,
  ){}

  ngOnInit(): void {
      this.forminit();
  }

  forminit(){
    this.addtaskform = this.fb.group({
      title: [''],
      description: [''],
      Image : [''],

    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

   

}
