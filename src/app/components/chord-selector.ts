import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChordService } from '../services/chord';
import { Chord } from '../models/chord';

@Component({
    selector: 'chord-selector',
    templateUrl: './chord-selector.html'
})
export class ChordSelectorComponent {
    @Input() selectorType: string;

    @Input()
    set strings(value) {
        this._strings = parseInt(value);
    }

    private _strings: number;
    private newChordName: string = "";

    get chordNames(): Array<string> {
        return Object.getOwnPropertyNames(this._chordService.getChords());
    }

    get currentChordName(): string {
        return this._chordService.getCurrentChordName();
    }

    set currentChordName(name: string) {
        this._chordService.setCurrentChordName(name);
    }

    constructor(private _chordService: ChordService) {
    }

    newChord() {
        this._chordService.newChord(this.newChordName, this._strings);
        this.newChordName = "";
    }
}