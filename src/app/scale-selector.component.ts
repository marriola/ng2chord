import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'scale-selector',
    templateUrl: './scale-selector.component.html'
})
export class ScaleSelectorComponent {
    @Input() scales;
    @Input() currentScaleName: string;

    @Output() batchTones: EventEmitter<Array<string>> = new EventEmitter()

    playScale(name): void {
        this.batchTones.emit(this.scales[name]);
    }
}