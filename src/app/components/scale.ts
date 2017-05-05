import { Component, Input } from '@angular/core';
import { ScaleService } from '../services/scale';
import { Scale } from '../models/scale';

@Component({
    selector: 'scale',
    template: ''
})
export class ScaleComponent {
    @Input() name: string;

    @Input()
    set intervals(value) {
        let intervals = value.split(',').map(x => parseInt(x));

        this._scaleService.addScale(new Scale(this.name, this.suffix, intervals));
    }

    constructor(private _scaleService: ScaleService) {
    }
}