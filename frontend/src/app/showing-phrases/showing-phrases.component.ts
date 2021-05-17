import { Component, OnInit } from '@angular/core';
import { backend } from 'src/backend';
import { MatDialog } from '@angular/material/dialog';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import {MatTableDataSource} from '@angular/material/table';

import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { eraseCookie } from 'src/cookies';

export interface PeriodicElement {
  phrase: string;
  id: number;
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
  phrases = [];
  displayedColumns: string[] = ['id', 'phrase', 'synonyms'];
   dataSource: MatTableDataSource<unknown>;


  constructor(public dialog:MatDialog){}

  async ngOnInit() {
    this.dataSource = new MatTableDataSource(await this.fetchPhrases());
      //alert(JSON.stringify( this.dataSource));
    
  }

  async fetchPhrases(){
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

  getSpecificSynonym(){
    try{
      this.dialog.open(DialogWindowComponent);
    } catch (error){
      alert(error)
    }
  }

  logOut(){
    eraseCookie('token');
    alert('You have signed out');
    location.reload();
  }
}