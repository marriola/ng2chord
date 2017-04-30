import { Component } from '@angular/core';
import { ChordService } from '../services/chord';
import { ScaleService } from '../services/scale';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  providers: [ScaleService, ChordService]
})
export class AppComponent {
}
