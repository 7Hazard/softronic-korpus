import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.styl']
})
export class DialogWindowComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public phrase) {
    // alert(JSON.stringify(data))
    
  }

  getSynonymText(){
    if(this.phrase.synonym == null)
      return "No synonyms";
      else return this.phrase.synonym.meaning.text
  }


  ngOnInit(): void {
  }

}
