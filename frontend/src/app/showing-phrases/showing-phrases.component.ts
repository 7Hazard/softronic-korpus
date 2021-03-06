import { Component, OnInit } from '@angular/core';
import { backend, fetchCustomerGroups } from 'src/backend';
import { MatDialog } from '@angular/material/dialog';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { MatTableDataSource } from '@angular/material/table';

import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { eraseCookie, getCookie } from 'src/cookies';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action } from 'rxjs/internal/scheduler/Action';
import { DialogNormalisingComponent } from '../dialog-normalising/dialog-normalising.component';
import { UpdatePhrasesComponent } from '../update-phrases/update-phrases.component';
import { DialogSynonymsComponent } from '../dialog-synonyms/dialog-synonyms.component';

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
  title = 'angular-mat-select-app';
  customerGroups = [];
  selectedCustomer: any;

  phraseForm = new FormGroup({ phrase: new FormControl() });
  phrase: string; // input from dialog window

  phrases = [];
  displayedColumns: string[] = ['id', 'phrase', 'synonyms', 'actions'];
  dataSource: MatTableDataSource<unknown>;
  phraseFilter: string = '';

  constructor(public dialog: MatDialog, public normalizeDialog: MatDialog, private snackBar: MatSnackBar) { }

  openNormalizeDialog(): void {
    const dialogRef = this.dialog.open(DialogNormalisingComponent);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogWindowComponent, {
      width: '460px', height: '320px',
      data: { phrase: this.phrase }
    });

    dialogRef.afterClosed().subscribe(async result => { //called when dialog window closed
      console.log('The dialog was closed');
      this.phrase = result;
      try {
        let response = await backend.post("/phrases", { text: this.phrase }, {
          headers: { authorization: `Bearer: ${getCookie("token")}` }
        })
        if (response.status != 200) {
          alert(response.data);
        }
      } catch (error) {
      }
      this.dataSource = new MatTableDataSource(await this.fetchPhrases());
      this.dataSource.paginator = this.paginator;
      
    });
  }

  openDialog2(id: any): void {

    const dialogRef = this.dialog.open(UpdatePhrasesComponent, {
      width: '460px', height: '320px',
      data: { phrase: this.phrase }
    });

    dialogRef.afterClosed().subscribe(async result => { //called when dialog window closed
      if(!result) return;
      this.phrase = result;
      try {
        let response = await backend.put(`/phrases/${id}`, { text: this.phrase }, {
          headers: { authorization: `Bearer: ${getCookie("token")}` }
        })
        if (response.status != 200) {

        }
      } catch (error) {
      }
      this.dataSource = new MatTableDataSource(await this.fetchPhrases());
      this.dataSource.paginator = this.paginator;
    });
  }

  showSynonyms(synonyms) {
    this.dialog.open(DialogSynonymsComponent, {
      data: { synonyms }
    });
  }

  async ngOnInit() {

    this.dataSource = new MatTableDataSource(await this.fetchPhrases());
    this.dataSource.filterPredicate = (data: any, filter) => {

      if (!data.text.toLowerCase().includes(this.phraseFilter)) {
        return false;
      }
      if (this.selectedCustomer == 'All') {
        return true;
      }
      if (this.selectedCustomer && data.synonyms.length > 0) {
        for (const synonym of data.synonyms) {
          if (synonym.group && synonym.group.name == this.selectedCustomer) {
            return true;
          }
        }
      }
      return false;
    }
    this.customerGroups = await fetchCustomerGroups();
    this.selectedCustomer = this.customerGroups[0].name;
    this.dataSource.paginator = this.paginator;
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
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.phraseFilter = filterValue.trim().toLowerCase();
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
    this.snackBar.open('Item deleted', 'Dismiss');
    try {
      let response = await backend.delete("/phrases",
        {
          headers: { authorization: `Bearer: ${getCookie("token")}` },
          data: { ids: [id] }
        })
    } catch (error) {
      alert(error)
    }
    this.dataSource = new MatTableDataSource(await this.fetchPhrases());
  }

  onSelectionChange(selectedCustomer) {
    console.log(selectedCustomer);
    this.dataSource.filter = selectedCustomer;
  }
}
