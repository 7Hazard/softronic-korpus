import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';

export interface SynonymsDialogData {
  synonyms: any[]
}

@Component({
  selector: 'app-dialog-synonyms',
  templateUrl: './dialog-synonyms.component.html',
  styleUrls: ['./dialog-synonyms.component.styl']
})
export class DialogSynonymsComponent implements OnInit {
  synonyms: any;

  constructor(
    public dialogRef: MatDialogRef<DialogWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SynonymsDialogData
  ) {
    this.synonyms = []
    for (const synonym of data.synonyms) {
      let group = synonym.group ? synonym.group.name : "All";
      console.log(JSON.stringify(synonym.meaning))
      this.synonyms.push({ group, text: synonym.meaning.text })
    }
  }

  ngOnInit(): void {

  }
}
