import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { FretboardComponent } from './fretboard.component';
import { ChordComponent } from './chord.component';
import { ScaleComponent } from './scale.component';

@NgModule({
  declarations: [
    AppComponent,
    FretboardComponent,
    ChordComponent,
    ScaleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
