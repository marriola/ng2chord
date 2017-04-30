import { Injectable } from '@angular/core';

let Scales = {};

@Injectable()
export class ScaleService {
    getScales() {
        return Scales;
    }
}