import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//imports necessary for angular material
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ShowingPhrasesComponent } from './showing-phrases/showing-phrases.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogWindowComponent } from './dialog-window/dialog-window.component';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator'
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DialogNormalisingComponent } from './dialog-normalising/dialog-normalising.component';
import { UpdatePhrasesComponent } from './update-phrases/update-phrases.component';
import { DialogSynonymsComponent } from './dialog-synonyms/dialog-synonyms.component';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatSelectModule,
    MatSnackBarModule
  ],entryComponents:[ DialogWindowComponent],
  providers: [],
  declarations: [
    AppComponent,
    ShowingPhrasesComponent,
    DialogWindowComponent,
    DialogNormalisingComponent,
    UpdatePhrasesComponent,
    DialogSynonymsComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
