import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ScaleService } from '../services/scale';
import { Scale } from '../types';

@Component({
    selector: 'scale-selector',
    templateUrl: './scale-selector.html'
})
export class ScaleSelectorComponent {
    get currentScaleName(): string {
        return this._scaleService.getCurrentScaleName();
    }

    set currentScaleName(name: string) {
        this._scaleService.setCurrentScaleName(name);
    }

    get scaleNames(): Array<string> {
        return Object.getOwnPropertyNames(this._scaleService.getScales());
    }

    get scales() {
        return this._scaleService.getScales();
    }

    constructor(private _scaleService: ScaleService) {
    }

    playScale(name): void {
        this._scaleService.playScale(name);
    }
}