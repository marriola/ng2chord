import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './components/app';
import { FretboardComponent } from './components/fretboard';
import { ChordSelectorComponent } from './components/chord-selector';
import { ScaleSelectorComponent } from './components/scale-selector';
import { ChordComponent } from './components/chord';
import { ScaleComponent } from './components/scale';

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
