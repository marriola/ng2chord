import { Component, Input } from "@angular/core";
import { ChordService } from '../services/chord';
import { ScaleService } from '../services/scale';
import { notes, getNoteIndex } from '../util';
import { TonePlayer } from '../tone';
import { Scale } from '../models/scale';
import { Chord } from '../models/chord';

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
    };

    ViewTypes = Object.getOwnPropertyNames(this.View);

    private _player: TonePlayer;
    private _frets: Fret[];
    private _chords;
    private _scales;
    private _stringsArray: string[] = [];
    private _dotPositionsArray: number[];
    private _doubleDotPositionsArray: number[];

    view = this.View.Chord;
    autoplay: boolean = true;
    currentString: number = null;
    currentFret: number = null;
    scaleHighlight: string = null;
    
    @Input() width: number;
    @Input('fretPositions') _fretPositions: string;
    @Input('selectorType') selectorType: string;

    @Input('dotPositions')
    set _dotPositions(value: string) {
        this._dotPositionsArray = value.split(',').map(x => parseInt(x));
    }

    get dotPositions(): number[] {
        return this._dotPositionsArray;
    }

    @Input('doubleDotPositions')
    set _doubleDotPositions(value: string) {
        this._doubleDotPositionsArray = value.split(',').map(x => parseInt(x));
    }

    get doubleDotPositions(): number[] {
        return this._doubleDotPositionsArray;
    }

    @Input('strings')
    set _strings(value: string) {
        this._stringsArray = value.split(',');
        this._player = new TonePlayer(this._stringsArray);
        this._player.currentChord = this._chordService.getCurrentChord();
    }

    get strings(): string[] {
        return this._stringsArray;
    }

    get chords() {
        return this._chords;
    }

    get chordNames(): string[] {
        return Object.getOwnPropertyNames(this.chords);
    }

    get currentChord(): Chord {
        return this._chordService.getCurrentChord();
    }
    
    get scales() {
        return this._scales;
    }

    get scaleNames(): string[] {
        return Object.getOwnPropertyNames(this.scales);
    }

    get currentScale(): Scale {
        return this._scaleService.getCurrentScale();
    }

    get frets(): Fret[] {
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

    get stringAndFret(): string {
        if (this.currentString === null || this.currentFret === null) {
            return 'Click me';
        }

        let fret = this.currentFret == -1 ? 'open' : `fret ${this.currentFret + 1}`;
        let noteIndex = notes.findIndex(x => x.note == this.strings[this.currentString]);
        let note = notes[noteIndex + this.currentFret + 1].note;

        return `${this.strings[this.currentString]} string, ${fret} (${note})`;
    }

    constructor(private _chordService: ChordService, private _scaleService: ScaleService) {
        this._chords = _chordService.getChords();
        this._scales = _scaleService.getScales();

        _chordService.chordSelected$.subscribe((name: string) => this.onSelectChord(name));

        _scaleService.batchTones$.subscribe((scale: string[]) => this.onBatchTones(scale));

        _scaleService.scaleSelected$.subscribe(() => {
            this.view = this.View.Scale;
        });
    }

    mouseover(string, fret): void {
        this.currentString = string;
        this.currentFret = fret - 1;
    }

    selectFret(string, fret): void {
        if (this.view != this.View.Chord) {
            this.view = this.View.Chord;
            return;
        }

        if (this.currentChord[string] == fret) {
            fret = null;
        }
        this.currentChord[string] = fret;

        if (this.autoplay) {
            this._player.toggleTones(true);
        }
    }

    onSelectChord(name: string): void {
        this.view = this.View.Chord;
        this._player.currentChord = this._chordService.getCurrentChord();
        this._player.toggleTones(this.autoplay);
    }

    batchTones(length: number, tones: Tone[], callback: (tone) => void, done: () => void): void {
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

    onBatchTones(noteNames: string[]): void {
        let tones = noteNames.map(name => notes[getNoteIndex(name)]);
        let length = 350;

        this.view = this.View.Scale;
        this.batchTones(length, tones,
            (tone) => {
                this.scaleHighlight = tone.note;
            },
            () => {
                this.scaleHighlight = null;
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
            (this.view == this.View.Scale && fret < 5 &&
                this._scaleService.getScaleNotes().includes(this.getNoteName(string, fret)));
    }
}