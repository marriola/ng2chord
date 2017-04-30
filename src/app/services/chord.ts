import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { Chord } from '../models/chord';

@Injectable()
export class ChordService {
    private _chords: any = {};
    private _currentChord: Chord;
    private _currentChordName: string;

    private _chordSelectedSource = new Subject<string>();

    chordSelected$ = this._chordSelectedSource.asObservable();

    getChords() {
        return this._chords;
    }

    getCurrentChord(): Chord {
        return this._chords[this._currentChordName];
    }

    getCurrentChordName(): string {
        return this._currentChordName;
    }

    setCurrentChordName(name: string) {
        this._currentChordName = name;
        this._chordSelectedSource.next(name);
    }

    addChord(chord): void {
        this._chords[chord.name] = chord.frets;
        if (!this._currentChordName) {
            this._currentChordName = chord.name;
            this._currentChord = chord.frets;
        }
    }

    newChord(name: string, numStrings: number): void {
        this._chords[name] = new Array(numStrings).fill(null);
        this._currentChordName = name;
        this._currentChord = this._chords[name];
        this._chordSelectedSource.next(name);
    }
}