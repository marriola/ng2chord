import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChordService } from '../services/chord';
import { Chord } from '../types';

@Component({
    selector: 'chord-selector',
    templateUrl: './chord-selector.html',
    providers: [ChordService]
})
export class ChordSelectorComponent {
    @Input() selectorType: string;
    @Input() currentChordName: string;
    @Output() select: EventEmitter<string> = new EventEmitter();
    @Output() new: EventEmitter<string> = new EventEmitter();

    newChordName: string = "";

    get chordNames(): Array<string> {
        return Object.getOwnPropertyNames(this._chordService.getChords());
    }

    constructor(private _chordService: ChordService) {
    }

    selectChord(name) {
        this.currentChordName = name;
        this.select.emit(name);
    }

    newChord() {
        this.new.emit(this.newChordName);
        this.newChordName = "";
    }
}