import { Component, Input } from "@angular/core";
import { notes, getNoteIndex } from '../util';

type Chord = Array<number>;
type Scale = Array<string>;

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
    templateUrl: './fretboard.component.html',
    styleUrls: ['./fretboard.component.css']
})
export class FretboardComponent {
    View = {
        Chord: 0,
        Scale: 1
    }

    private _currentChordName: string;
    private _currentScaleName: string;
    private _frets: Array<Fret>;
    private _chords = {};
    private _scales = {};
    private _audio: AudioContext;
    private _oscillators: Array<OscillatorNode> = [];

    @Input() width: number;
    @Input('fretPositions') _fretPositions: string;
    @Input('strings') _strings: string;
    @Input('selectorType') selectorType: string;
    
    view = this.View.Chord;
    autoplay: boolean = true;
    playing: boolean = false;
    currentChord: Chord = null;
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

    get strings(): Array<string> {
        return this._strings.split(',');
    }

    get chordNames(): Array<string> {
        return Object.getOwnPropertyNames(this.chords);
    }

    get scaleNames(): Array<string> {
        return Object.getOwnPropertyNames(this.scales);
    }

    get stringAndFret(): string {
        if (this.currentString === null || this.currentFret === null) {
            return '';
        }

        let fret = this.currentFret == -1 ? 'open' : `fret ${this.currentFret + 1}`;
        let noteIndex = notes.findIndex(x => x.note == this.strings[this.currentString]);
        let note = notes[noteIndex + this.currentFret + 1].note;

        return `${this.strings[this.currentString]} string, ${fret} (${note})`;
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

    onSelectChord(name) {
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

    startTones(): void {
        for (let osc of this._oscillators) {
            osc.start();
        }
    }

    stopTones(): void {
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
                    this.addTone(note.frequency);
                }
                stringIndex++;
            }
            // console.groupEnd();

            this.startTones();
        }
    }

    addTone(freq: number, type: string = 'sine'): OscillatorNode {
        let osc = this._audio.createOscillator();
        this._oscillators.push(osc);
        osc.connect(this._audio.destination);
        osc.type = type;
        osc.frequency.value = freq;

        return osc;
    }

    batchTones(length: number, tones: Array<Tone>, callback: (tone) => void, done: () => void): void {
        let timeout: number = 0;

        this.stopTones();
        let osc = this.addTone(0);
        osc.start();

        for (let tone of tones) {
            console.log(timeout);
            setTimeout(() => {
                osc.frequency.value = tone.frequency;
                callback(tone);
            }, timeout);

            timeout += length;
        }

        setTimeout(done, timeout + length);
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
                this.stopTones();
                this.scaleHighlight = null;
                this.view = this.View.Chord;
            });
    }

    getNoteName(string, fret) {
        let noteIndex = getNoteIndex(this.strings[string]) + fret;
        return notes[noteIndex].note;
    }
}