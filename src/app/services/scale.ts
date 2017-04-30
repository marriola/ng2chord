import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Scale } from '../models/scale';

@Injectable()
export class ScaleService {
    private _scales: any = {};
    private _currentScale: Scale;
    private _currentScaleName: string;
    private _currentKey: string = 'C2';
    private _scaleNotes: string[];

    private _scaleSelectedSource = new Subject<string>();
    private _batchTonesSource = new Subject<string[]>();

    scaleSelected$ = this._scaleSelectedSource.asObservable();
    batchTones$ = this._batchTonesSource.asObservable();

    getScales() {
        return this._scales;
    }

    getCurrentKey(): string {
        return this._currentKey;
    }

    setCurrentKey(key: string): void {
        this._currentKey = key;
        if (this._currentScale) {
            this._scaleNotes = this._currentScale.inKeyOf(key);
        }
    }

    getCurrentScale(): Scale {
        return this._scales[this._currentScaleName];
    }

    getScaleNotes(): string[] {
        return this._scaleNotes;
    }

    getCurrentScaleName(): string {
        return this._currentScaleName;
    }

    getScale(name: string): Scale {
        return this._scales[name];
    }

    addScale(scale: any): void {
        this._scales[scale.name] = scale;
        if (!this._currentScale) {
            this._currentScale = scale;
            this._currentScaleName = scale.name;
            if (this._currentKey) {
                this._scaleNotes = scale.inKeyOf(this._currentKey);
            }
        }
    }

    setCurrentScaleName(name: string): void {
        this._currentScaleName = name;
        if (this._currentKey) {
            this._scaleNotes = this._scales[name].inKeyOf(this._currentKey);
        }

        this._scaleSelectedSource.next(name);
    }

    playScale(name: string): void {
        console.log(`scale service: batch ${name}`);
        this._batchTonesSource.next(this._scales[name].inKeyOf(this._currentKey));
    }
}