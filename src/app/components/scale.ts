import { Component, Input, Host } from '@angular/core';
import { FretboardComponent } from './fretboard';

@Component({
    selector: 'scale',
    template: ''
})
export class ScaleComponent {
    @Input() name: string;

    @Input()
    set notes(value) {
        let notes = value.split(',');

        this.parent.addScale({
            name: this.name,
            notes
        });
    }

    constructor(@Host() private parent: FretboardComponent) {
    }
}