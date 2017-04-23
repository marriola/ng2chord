import { Component, Input } from "@angular/core";
import { notes, getNoteIndex } from '../util';

type Chord = Array<number>;

interface Fret {
    index: number;
    width: number;
    left: number;
}

@Component({
    selector: 'fretboard',
    templateUrl: './fretboard.component.html',
    styleUrls: ['./fretboard.component.css']
})
export class FretboardComponent {
    private _currentChordName: string;
    private _frets: Array<Fret>;
    private _chords = {};
    private _audio: AudioContext;
    private _oscillators: Array<OscillatorNode> = [];

    @Input() width: number;
    @Input('fretPositions') _fretPositions: string;
    @Input('strings') _strings: string;
    @Input('selectorType') selectorType: string;
    
    autoplay: boolean = true;
    playing: boolean = false;
    currentChord: Chord = null;
    currentString: number = null;
    currentFret: number = null;
    
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

    get strings(): Array<string> {
        return this._strings.split(',');
    }

    get chordNames(): Array<string> {
        return Object.getOwnPropertyNames(this.chords);
    }

    constructor() {
        this._audio = new AudioContext();
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
            this.toggleTones(true);
        }
    }

    selectChord(name) {
        this._currentChordName = name;
        this.currentChord = this.chords[name];
        this.toggleTones(this.autoplay);
    }

    addChord(chord): void {
        this._chords[chord.name] = chord.frets;
        if (this.currentChord == null) {
            this._currentChordName = chord.name;
            this.currentChord = chord.frets;
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

    toggleTones(playing = !this.playing) {
        if (this.playing) {
            this.stopTones();
        }

        this.playing = playing;

        if (this.playing) {
            let stringIndex = 0;
            // console.group('chord');
            for (let fret of this.currentChord) {
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
        }
    }
}