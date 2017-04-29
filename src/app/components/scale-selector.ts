import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'scale-selector',
    templateUrl: './scale-selector.html'
})
export class ScaleSelectorComponent {
    @Input() scales;
    @Input() scaleNames: Array<string>;
    @Input() currentScaleName: string;

    @Output() select: EventEmitter<string> = new EventEmitter();
    @Output() batchTones: EventEmitter<Array<string>> = new EventEmitter();

    playScale(name): void {
        this.batchTones.emit(this.scales[name]);
    }

    selectScale(): void {
        this.select.emit(this.currentScaleName);
    }
}