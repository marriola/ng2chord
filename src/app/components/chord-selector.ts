import { Component, Input, Output, EventEmitter } from '@angular/core';

type Chord = Array<number>;

@Component({
    selector: 'chord-selector',
    templateUrl: './chord-selector.html'
})
export class ChordSelectorComponent {
    @Input() selectorType: string;
    @Input() currentChordName: string;
    @Input() chords: Array<Chord>;
    @Input() chordNames: Array<string>;

    @Output() select: EventEmitter<string> = new EventEmitter();
    @Output() new: EventEmitter<string> = new EventEmitter();

    newChordName: string = "";

    selectChord(name) {
        this.currentChordName = name;
        this.select.emit(name);
    }

    newChord() {
        this.new.emit(this.newChordName);
        this.newChordName = "";
    }
}