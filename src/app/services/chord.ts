import { Injectable } from "@angular/core";

let Chords = {};

@Injectable()
export class ChordService {
    getChords() {
        return Chords;
    }
}