import { notes, getNoteIndex } from './util';
import { Chord, Scale } from './types';

export class TonePlayer {
    private _audio: AudioContext;
    private _oscillators: Array<OscillatorNode> = [];

    currentChord: Chord = null;
    playing: boolean = false;

    constructor(private _strings: Array<string>) {
        this._audio = new AudioContext();
    }

    addTone(freq: number, type: string = 'sine'): OscillatorNode {
        let osc = this._audio.createOscillator();
        this._oscillators.push(osc);
        osc.connect(this._audio.destination);
        osc.type = type;
        osc.frequency.value = freq;

        return osc;
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
                    let noteIndex = getNoteIndex(this._strings[stringIndex]) + fret;
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
}