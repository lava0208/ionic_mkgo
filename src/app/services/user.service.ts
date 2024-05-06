import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) {
    }

    updateuserr(id, data) {
        return this.http.put(environment.basurl + 'api/users/' + id, data)
        .pipe(map(data => {
            return data;
        })).toPromise();
    }

    getallchauffeurpartype(data) {
        return this.http.post(environment.basurl + 'apis/employespartype', data);
    }


    addremarque(data) {
        return this.http.post(environment.basurl + 'api/remarques', data);
    }
}
