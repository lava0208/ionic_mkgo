import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EntrepriseService {

    constructor(private http: HttpClient) {
    }


    getentreprisebyId(id) {
        return this.http.get(environment.basurl + 'api/entreprises/' + id);
    }

    getalllicences() {
        return this.http.get(environment.basurl + 'api/licences');
    } getallentreprise() {
        return this.http.get(environment.basurl + 'api/entreprises');
    }
}
