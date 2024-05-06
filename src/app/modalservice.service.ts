import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModalserviceService {

    constructor() {
    }

    modalInst = [];
    i = 0;

    storeModal(x) {
        this.modalInst[this.i] = x;
        this.i++;
    }
}
