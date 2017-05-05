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
    keys: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(x => x + '3');

    get currentKey(): string {
        return this._scaleService.getCurrentKey();
    }

    set currentKey(key: string) {
        this._scaleService.setCurrentKey(key);
        // trigger scale change event so fretboard changes to scale view
        this._scaleService.setCurrentScaleName(this.currentScaleName);
    }
    
    get currentScaleName(): string {
        return this._scaleService.getCurrentScaleName();
    }

    set currentScaleName(name: string) {
        this._scaleService.setCurrentScaleName(name);
    }

    get scaleNames(): string[] {
        return Object.getOwnPropertyNames(this._scaleService.getScales());
    }

    get scales() {
        return this._scaleService.getScales();
    }
    
    constructor(private _scaleService: ScaleService) {
    }

    getScaleNotes(): string {
        return this._scaleService.getCurrentScale().inKeyOf(this.currentKey).join(' - ');
    }

    playScale(name): void {
        this._scaleService.playScale(name);
    }

    decrement(): void {
        let keyIndex: number = this.keys.indexOf(this.currentKey);
        if (--keyIndex < 0) {
            keyIndex = this.keys.length - 1;
        }
        this.currentKey = this.keys[keyIndex];
    }

    increment(): void {
        let keyIndex: number = this.keys.indexOf(this.currentKey);
        if (++keyIndex == this.keys.length) {
            keyIndex = 0;
        }
        this.currentKey = this.keys[keyIndex];
    }
}