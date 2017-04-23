import { Component, Input } from "@angular/core";
import { notes, getNoteIndex } from '../util';

type Chord = Array<number>;

@Component({
    selector: 'fretboard',
    templateUrl: './fretboard.component.html',
    styleUrls: ['./fretboard.component.css']
})
export class FretboardComponent {
    private _fretPositionsArray: Array<number> = null;
    private _fretWidths: Array<number> = null;
    private _currentChord: Chord = null;
    private _currentChordAdjusted: Chord = null;
    private _frets: Array<number>;
    private _chords = {}
    private _audio: AudioContext;
    private _oscillators: Array<OscillatorNode> = [];

    @Input() width: number;
    @Input('fretPositions') _fretPositions: string;
    @Input('strings') _strings: string;
    
    autoplay: boolean = true;
    playing: boolean = false;
    currentString: number = null;
    currentFret: number = null;
    
    get frets(): Array<number> {
        if (!this._frets) {
            this._frets = new Array(24).fill(0).map((x, i) => i);
        }

        return this._frets;
    }

    get chords() {
        return this._chords;
    }

    get strings(): Array<string> {
        return this._strings.split(',');
    }

    get fretPositions(): Array<number> {
        if (!this._fretPositionsArray) {
            this._fretPositionsArray = this._fretPositions.split(',').map(x => parseFloat(x));
            // -1th fret has position 0 so that 0th fret's width can be calculated more conveniently
            this._fretPositionsArray[-1] = 0;
        }

        return this._fretPositionsArray;
    }

    get fretWidths(): Array<number> {
        if (!this._fretWidths) {
            this._fretWidths = this.fretPositions.map((x, i) => {
                return this.fretPositions[i] - this.fretPositions[i - 1];
            });
        }

        return this._fretWidths;
    }

    get currentChord(): Chord {
        return this._currentChord.map(x => {
            return x == null ? null : x - 1;
        });
    }

    get chordNames(): Array<string> {
        return Object.getOwnPropertyNames(this.chords);
    }

    constructor() {
        this._audio = new AudioContext();
    }

    mouseover(string, fret): void {
        this.currentString = string;
        this.currentFret = fret;
    }

    selectFret(string, fret): void {
        if (this._currentChord[string] == fret + 1) {
            this._currentChord[string] = null;
        } else {
            this._currentChord[string] = fret + 1;
        }

        if (this.autoplay) {
            this.toggleTone(true);
        }
    }

    addChord(chord): void {
        this._chords[chord.name] = chord.frets;
        if (this._currentChord == null) {
            this._currentChord = chord.frets;
        }
    }

    getStringAndFret(): string {
        if (this.currentString === null || this.currentFret === null) {
            return '';
        }

        let fret = this.currentFret == -1 ? 'open' : `fret ${this.currentFret + 1}`;
        let noteIndex = notes.findIndex(x => x.note == this.strings[this.currentString]);
        let note = notes[noteIndex + this.currentFret + 1].note;

        return `${this.strings[this.currentString]} string, ${fret} (${note})`;
    }

    stopTones() {
        for (let osc of this._oscillators) {
            osc.stop();
        }
        this._oscillators = [];
    }

    toggleTone(playing = !this.playing) {
        if (this.playing) {
            this.stopTones();
        }

        this.playing = playing;

        if (this.playing) {
            let stringIndex = 0;
            // console.group('chord');
            for (let fret of this._currentChord) {
                if (fret !== null) {
                    let noteIndex = getNoteIndex(this.strings[stringIndex]) + fret;
                    let note = notes[noteIndex];
                    // console.log(`${note.note} ${note.frequency}`);
                    let osc = this._audio.createOscillator();
                    this._oscillators.push(osc);
                    osc.connect(this._audio.destination);
                    osc.type = 'sine';
                    osc.frequency.value = note.frequency;
                    osc.start();
                }
                stringIndex++;
            }
            // console.groupEnd();
        } else {
            this.stopTones();
        }
    }
}