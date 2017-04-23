import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { FretboardComponent } from './fretboard.component';
import { ChordSelectorComponent } from './chord-selector.component';
import { ScaleSelectorComponent } from './scale-selector.component';
import { ChordComponent } from './chord.component';
import { ScaleComponent } from './scale.component';

@NgModule({
  declarations: [
    AppComponent,
    FretboardComponent,
    ChordSelectorComponent,
    ScaleSelectorComponent,
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
