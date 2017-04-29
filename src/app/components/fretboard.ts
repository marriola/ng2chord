import { Component, Input } from "@angular/core";
import { notes, getNoteIndex } from '../util';
import { TonePlayer } from '../tone';
import { Chord, Scale } from '../types';

interface Fret {
    index: number;
    width: number;
    left: number;
}

interface Tone {
    note: string;
    frequency: number;
}

@Component({
    selector: 'fretboard',
    templateUrl: './fretboard.html',
    styleUrls: ['./fretboard.css']
})
export class FretboardComponent {
    View = {
        Chord: 0,
        Scale: 1
    }

    private _player: TonePlayer;
    private _currentChord: Chord;
    private _currentChordName: string;
    private _currentScaleName: string;
    private _frets: Array<Fret>;
    private _chords = {};
    private _scales = {};
    private _stringsArray: Array<string> = [];
    private _dotPositionsArray: Array<number>;
    private _doubleDotPositionsArray: Array<number>;

    @Input() width: number;
    @Input('fretPositions') _fretPositions: string;
    @Input('selectorType') selectorType: string;

    @Input('dotPositions')
    set _dotPositions(value: string) {
        this._dotPositionsArray = value.split(',').map(x => parseInt(x));
    }

    get dotPositions(): Array<number> {
        return this._dotPositionsArray;
    }

    @Input('doubleDotPositions')
    set _doubleDotPositions(value: string) {
        this._doubleDotPositionsArray = value.split(',').map(x => parseInt(x));
    }

    get doubleDotPositions(): Array<number> {
        return this._doubleDotPositionsArray;
    }

    @Input('strings')
    set _strings(value: string) {
        this._stringsArray = value.split(',');
        this._player = new TonePlayer(this._stringsArray);
    }

    get strings(): Array<string> {
        return this._stringsArray;
    }
    
    set currentChord(value: Chord) {
        this._currentChord = value;
        this._player.currentChord = value;
    }

    get currentChord(): Chord {
        return this._currentChord;
    }
    
    view = this.View.Chord;
    autoplay: boolean = true;
    currentScale: Scale = null;
    currentString: number = null;
    currentFret: number = null;
    scaleHighlight: string = null;
    
    get frets(): Array<Fret> {
        if (!this._frets) {
            let fretPositions = this._fretPositions.split(',').map(x => parseFloat(x));
            // The imaginary 0th fret just before the 1st fret has position 0 so that its width can be
            // calculated more conveniently.
            fretPositions[-1] = 0;

            let fretWidths = fretPositions.map((x, i, arr) => {
                return x - arr[i - 1];
            });

            this._frets = new Array(fretPositions.length).fill(0).map((x, i) => ({
                index: i + 1,
                width: fretWidths[i],
                left: fretPositions[i - 1]
            }));

            this._frets.splice(0, 0, {
               index: 0,
               width: null,
               left: null 
            });
        }

        return this._frets;
    }

    get chords() {
        return this._chords;
    }

    get scales() {
        return this._scales;
    }

    get chordNames(): Array<string> {
        return Object.getOwnPropertyNames(this.chords);
    }

    get scaleNames(): Array<string> {
        return Object.getOwnPropertyNames(this.scales);
    }

    get stringAndFret(): string {
        if (this.currentString === null || this.currentFret === null) {
            return 'Click me';
        }

        let fret = this.currentFret == -1 ? 'open' : `fret ${this.currentFret + 1}`;
        let noteIndex = notes.findIndex(x => x.note == this.strings[this.currentString]);
        let note = notes[noteIndex + this.currentFret + 1].note;

        return `${this.strings[this.currentString]} string, ${fret} (${note})`;
    }

    mouseover(string, fret): void {
        this.currentString = string;
        this.currentFret = fret - 1;
    }

    selectFret(string, fret): void {
        if (this.currentChord[string] == fret) {
            fret = null;
        }
        this.currentChord[string] = fret;

        if (this.autoplay) {
            this._player.toggleTones(true);
        }
    }

    onSelectChord(name) {
        this._currentChordName = name;
        this.currentChord = this.chords[name];
        this._player.toggleTones(this.autoplay);
    }

    onSelectScale(name) {
        this._currentScaleName = name;
        this.currentScale = this._scales[name];
    }

    addChord(chord): void {
        this._chords[chord.name] = chord.frets;
        if (this.currentChord == null) {
            this._currentChordName = chord.name;
            this.currentChord = chord.frets;
        }
    }

    onNewChord(name): void {
        this._chords[name] = new Array(this.strings.length).fill(null);
        this._currentChordName = name;
        this.currentChord = this._chords[name];
    }

    addScale(scale): void {
        this._scales[scale.name] = scale.notes;
        if (this.currentScale == null) {
            this._currentScaleName = scale.name;
            this.currentScale = scale.notes;
        }
    }

    batchTones(length: number, tones: Array<Tone>, callback: (tone) => void, done: () => void): void {
        let timeout: number = 0;

        this._player.stopTones();
        let osc = this._player.addTone(0);
        osc.start();

        for (let tone of tones) {
            setTimeout(() => {
                osc.frequency.value = tone.frequency;
                callback(tone);
            }, timeout);

            timeout += length;
        }

        setTimeout(() => {
            this._player.stopTones();
            done();
        }, timeout + length);
    }

    onBatchTones(noteNames: Array<string>): void {
        let tones = noteNames.map(name => notes[getNoteIndex(name)]);
        let length = 350;

        this.view = this.View.Scale;
        this.batchTones(length, tones,
            (tone) => {
                this.scaleHighlight = tone.note;
            },
            () => {
                this.scaleHighlight = null;
                this.view = this.View.Chord;
            });
    }

    getNoteName(string, fret) {
        let noteIndex = getNoteIndex(this.strings[string]) + fret;
        return notes[noteIndex].note;
    }

    isHighlighted(string, fret, point) {
        return this.view == this.View.Scale && fret < 5 &&
            this.scaleHighlight == this.getNoteName(string, fret);
    }

    isFretted(string, fret, point) {
        return (this.view == this.View.Chord && fret == point) ||
            (this.view == this.View.Scale && fret < 5 && this.currentScale.includes(this.getNoteName(string, fret)));
    }
}