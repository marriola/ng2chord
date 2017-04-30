import { Component, Input } from '@angular/core';
import { ChordService } from '../services/chord';

@Component({
    selector: 'chord',
    template: ''
})
export class ChordComponent {
    @Input() strings: number;
    @Input() name: string;

    @Input()
    set frets(value) {
        let frets = value
            .split(',')
            .map(x => x == '-' ? null : parseInt(x));

        this._chordService.addChord({
            name: this.name,
            frets
        });
    }

    constructor(private _chordService: ChordService) {
    }
}