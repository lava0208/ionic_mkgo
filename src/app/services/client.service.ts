import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    constructor(private http: HttpClient) {
    }


    getonedispatcher() {

        return this.http.get(environment.basurl + 'apis/dispatcher');

    }

    getclientbyId(id) {
        return this.http.get(environment.basurl + 'apis/clientid/' + id);
    }



    getemployeebyId(id) {
        return this.http.get(environment.basurl + 'api/employes/' + id)
        .pipe(map(data => {
        return data;
        })).toPromise();
    }

    getusersbyId(id) {
        return this.http.get(environment.basurl + 'api/users/' + id);
    }

    getclientbytype(type) {
        return this.http.get(environment.basurl + 'apis/clienttype/' + type);
    }

    getclients() {
        return this.http.get(environment.basurl + 'apis/listeclient');
    }

    addclient(data) {
        return this.http.post(environment.basurl + 'api/clients', data);
    }

    addAdresse(data) {
        return this.http.post(environment.basurl + 'api/listeadresses', data);
    }

    getalltypeclient() {
        return this.http.get(environment.basurl + 'api/typeclients');
    }

    getallAdresses(id) {
        return this.http.get<any>(environment.basurl + 'apis/listeadresse/' + id)
        .pipe(map(data  => {
            return data;
        })).toPromise();
    }
}
