import { notes, getNoteIndex } from '../util';

export class Scale {
    constructor(public name: string, public intervals: number[]) {
    }

    inKeyOf(key: string): string[] {
        let keyIndex: number = getNoteIndex(key);
        let out: string[] = [];
        let offset: number = 0;

        for (let interval of this.intervals) {
            out.push(notes[keyIndex + offset].note);
            offset += interval;
        }

        return out;
    }
}