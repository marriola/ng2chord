import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScaleService } from '../services/scale';

@Component({
    selector: 'scale-selector',
    templateUrl: './scale-selector.html',
    providers: [ScaleService]
})
export class ScaleSelectorComponent {
    @Input() currentScaleName: string;
    
    @Output() select: EventEmitter<string> = new EventEmitter();
    @Output() batchTones: EventEmitter<Array<string>> = new EventEmitter();

    get scaleNames(): Array<string> {
        return Object.getOwnPropertyNames(this._scaleService.getScales());
    }

    get scales() {
        return this._scaleService.getScales();
    }

    constructor(private _scaleService: ScaleService) {
    }

    playScale(name): void {
        this.batchTones.emit(this.scales[name]);
    }

    selectScale(): void {
        this.select.emit(this.currentScaleName);
    }
}