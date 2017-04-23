import { Component, Host, Input } from '@angular/core';
import { FretboardComponent } from './fretboard.component';

@Component({
    selector: 'chord',
    template: ''
})
export class ChordComponent {
    @Input() name: string;

    @Input()
    set frets(value) {
        let frets = value
            .split(',')
            .map(x => x == '-' ? null : parseInt(x));

        this.parent.addChord({
            name: this.name,
            frets
        });
    }

    constructor(@Host() private parent: FretboardComponent) {
    }
}