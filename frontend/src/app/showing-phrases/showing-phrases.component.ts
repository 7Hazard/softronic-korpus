import { Component, OnInit } from '@angular/core';
import { backend } from 'src/backend';
import { MatDialog } from '@angular/material/dialog';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import {MatTableDataSource} from '@angular/material/table';

import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';

export interface PeriodicElement {
  phrase: string;
  id: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, phrase: 'Läsk'},
  {id: 2, phrase: 'Dryck'},
  {id: 3, phrase: 'Cola'},
  {id: 4, phrase: 'Vätska'},
  {id: 5, phrase: 'Vin'},
  {id: 6, phrase: 'Nocco'},
  {id: 7, phrase: 'Clean'},
  {id: 8, phrase: 'Monster'},
  {id: 9, phrase: 'Powerking'},
  {id: 10, phrase: 'Haiwa'},
];

/**
 * @title Table with filtering
 */
 @Component({
  selector: 'app-showing-phrases',
  templateUrl: './showing-phrases.component.html',
  styleUrls: ['./showing-phrases.component.styl']
})

export class ShowingPhrasesComponent {
  displayedColumns: string[] = ['id', 'phrase', 'synonyms'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(public dialog:MatDialog){}

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
}