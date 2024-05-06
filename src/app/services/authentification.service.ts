import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import { StorageService } from './storage/storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthentificationService {


    constructor(
        private http: HttpClient,
        private storageService: StorageService,
        ) {

    }

    async login(data1:any) {
        return this.http.post(environment.basurl + 'apis/logins', data1)
        .pipe(
            map(async data => {
              // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
              if(data[0])
              {
                //init storage
                this.storageService.init();
                await this.storageService.set('currentClientUser',JSON.stringify(data[0]));
                //this.currentClientUserSubject$.next(data[0]);
              }
              return data;
          })).toPromise();
    }

    inscription(data) {

        return this.http.post(environment.basurl + 'api/employes', data, {observe: 'response'});

    }

    inscriptionchauffeur(data) {

        return this.http.post(environment.basurl + 'apis/inscription', data);

    }


}
