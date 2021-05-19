import { Component, OnInit } from '@angular/core';
import { backend } from 'src/backend';
import { MatDialog } from '@angular/material/dialog';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { MatTableDataSource } from '@angular/material/table';

import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { eraseCookie, getCookie } from 'src/cookies';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { UpdatePhrasesComponent } from '../update-phrases/update-phrases.component';

export interface PeriodicElement {
  phrase: string;
  id: number;
}

export interface DialogData {
  phrase: string;
}

/**
 * @title Table with filtering
 */
@Component({
  selector: 'app-showing-phrases',
  templateUrl: './showing-phrases.component.html',
  styleUrls: ['./showing-phrases.component.styl']
})

export class ShowingPhrasesComponent {
  phraseForm = new FormGroup({ phrase: new FormControl() });
  phrase: string; // input from dialog window

  phrases = [];
  displayedColumns: string[] = ['id', 'phrase', 'synonyms', 'actions'];
  dataSource: MatTableDataSource<unknown>;

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogWindowComponent, {
      width: '250px',
      data: { phrase: this.phrase }
    });

    dialogRef.afterClosed().subscribe(async result => { //called when dialog window closed
      console.log('The dialog was closed');
      this.phrase = result;
      alert(result)
      try {
        let response = await backend.post("/phrases", { text: this.phrase }, {
          headers: { authorization: `Bearer: ${getCookie("token")}` }
        })
        if (response.status != 200) {
          alert('Response is not 200');
        }
      } catch (error) {
        alert(error)
      }
      //this.dataSource.data.push(this.phrase);
      location.reload();
      //this.phrases.push(this.phrase);
      //alert(this.phrase)
    });
  }

  openDialog2(id: any): void {
    
    const dialogRef = this.dialog.open(UpdatePhrasesComponent, {
      width: '250px',
      data: { phrase: this.phrase }
    });

    dialogRef.afterClosed().subscribe(async result => { //called when dialog window closed
      console.log('The dialog was closed');
      this.phrase = result;
      alert(result)
      try {
        let response = await backend.put(`/phrases/${id}`, { text: this.phrase }, {
          headers: { authorization: `Bearer: ${getCookie("token")}` }
        })
        if (response.status != 200) {
          alert('Response is not 200');
        }
      } catch (error) {
        alert(error)
      }
      //this.dataSource.data.push(this.phrase);
      location.reload();
      //this.phrases.push(this.phrase);
      //alert(this.phrase)
    });
  }



  async ngOnInit() {
    this.dataSource = new MatTableDataSource(await this.fetchPhrases());
    
    //alert(JSON.stringify( this.dataSource));
  }

  async fetchPhrases() {
    try {
      let response = await backend.get("/phrases")
      if (response.status != 200)
        alert(response.data)
      else {
        return response.data;
      }
    } catch (error) {
      alert(error)
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSpecificSynonym() {
    try {
      this.dialog.open(DialogWindowComponent);
    } catch (error) {
      alert(error)
    }
  }

  logOut() {
    eraseCookie('token');
    alert('You have signed out');
    location.reload();
  }

  async deleteSynonym(id: any) {
    alert(id);
    try{
    let response = await backend.delete("/phrases",
      {
        headers: { authorization: `Bearer: ${getCookie("token")}` },
        data: { ids: [id] }
      })
    }catch(error){
      alert(error)
    }
      location.reload();
  }

  async updateSynonymm(id: any) {


    alert(id);
    try{
    let response = await backend.put(id,
      {
        
        headers: { authorization: `Bearer: ${getCookie("token")}` },
        data: { ids: [id] }
      })
    }catch(error){
      alert(error)
    }
      location.reload();
  }

}
