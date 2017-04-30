import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Scale } from '../types';

@Injectable()
export class ScaleService {
    private _scales: any = {};
    private _currentScale: Scale;
    private _currentScaleName: string;

    private _scaleSelectedSource = new Subject<string>();
    private _batchTonesSource = new Subject<Scale>();

    scaleSelected$ = this._scaleSelectedSource.asObservable();
    batchTones$ = this._batchTonesSource.asObservable();

    getScales() {
        return this._scales;
    }

    getCurrentScale(): Scale {
        return this._scales[this._currentScaleName];
    }

    getCurrentScaleName(): string {
        return this._currentScaleName;
    }

    addScale(scale: any): void {
        this._scales[scale.name] = scale.notes;
        if (!this._currentScale) {
            this._currentScale = scale.notes;
            this._currentScaleName = scale.name;
        }
    }

    setCurrentScaleName(name: string): void {
        this._currentScaleName = name;
        this._scaleSelectedSource.next(name);
    }

    playScale(name: string): void {
        console.log(`scale service: batch ${name}`);
        this._batchTonesSource.next(this._scales[name]);
    }
}