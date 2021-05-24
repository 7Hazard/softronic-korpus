import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { DialogData } from '../showing-phrases/showing-phrases.component';

@Component({
  selector: 'app-update-phrases',
  templateUrl: './update-phrases.component.html',
  styleUrls: ['./update-phrases.component.styl']
})
export class UpdatePhrasesComponent implements OnInit {

  phrase:string;

  constructor(
    public dialogReff: MatDialogRef<DialogWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
  }

}
