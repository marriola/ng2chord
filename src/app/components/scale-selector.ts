import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ScaleService } from '../services/scale';
import { Scale } from '../models/scale';
import { notes, getNoteIndex } from '../util';

@Component({
    selector: 'scale-selector',
    templateUrl: './scale-selector.html'
})
export class ScaleSelectorComponent {
    keys: Array<string> = ['C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2'];

    get currentKey(): string {
        return this._scaleService.getCurrentKey();
    }

    set currentKey(key: string) {
        this._scaleService.setCurrentKey(key);
    }

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

    getScaleNotes(): string {
        return this._scaleService.getCurrentScale().inKeyOf(this._scaleService.getCurrentKey()).join(' - ');
    }

    playScale(name): void {
        this._scaleService.playScale(name);
    }
}