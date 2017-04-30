import { Component, Input } from '@angular/core';
import { ScaleService } from '../services/scale';

@Component({
    selector: 'scale',
    template: ''
})
export class ScaleComponent {
    @Input() name: string;

    @Input()
    set notes(value) {
        let notes = value.split(',');

        this._scaleService.addScale({
            name: this.name,
            notes
        });
    }

    constructor(private _scaleService: ScaleService) {

    }
}