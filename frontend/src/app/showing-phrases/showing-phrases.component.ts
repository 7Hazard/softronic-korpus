import { Component, OnInit } from '@angular/core';
import { backend } from'src/backend';
import {MatDialog} from '@angular/material/dialog';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';

@Component({
  selector: 'app-showing-phrases',
  templateUrl: './showing-phrases.component.html',
  styleUrls: ['./showing-phrases.component.styl']
})
export class ShowingPhrasesComponent implements OnInit {

  constructor (public dialog: MatDialog){}

  openDialog(){
    this.dialog.open(DialogWindowComponent);
  }


  async ngOnInit() {
    try {
      let response = await backend.get("/phrases")
      if(response.status != 200)
        alert(response.data)
      else {
        this.phrases = response.data
      }
    } catch (error) {
      alert(error)
    }
  }

  phrases = [];

}
