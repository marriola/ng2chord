import { Component, Host, Input } from '@angular/core';
import { FretboardComponent } from './fretboard.component';

@Component({
    selector: 'chord',
    template: ''
})
export class ChordComponent {
    parent: FretboardComponent;

    @Input() name: string;

    @Input()
    set notes(value) {
        let notes = value
            .split(',')
            .map(x => x == '-' ? null : parseInt(x));

        this.parent.addChord({
            name: this.name,
            notes
        });
    }

    constructor(@Host() parent: FretboardComponent) {
        this.parent = parent;
    }
}