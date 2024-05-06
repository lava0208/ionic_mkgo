import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AffectationService {
    constructor(private http: HttpClient) {
    }


    addaffect(data) {

        return this.http.post(environment.basurl + 'apis/addaffectationcourse', data);

    }

}
