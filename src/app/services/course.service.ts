import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

declare var google;

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    const;
    optionRequete = {
        headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*'
        })
    };

    constructor(private http: HttpClient) {
    }

    getaffectnotif(data) {
        return this.http.post(environment.basurl + 'apis/listecoursenotif', data);
    }

    getaffectById(id) {

        return this.http.get(environment.basurl + 'api/affectationcourses/' + id);
    }   
    
    getaffectbyId(id) {
        return this.http.get(environment.basurl + 'api/affectationcourses/' + id)
        .pipe(map(data => {
            return data;
        })).toPromise();
    }

    getcoursepanier() {
        return this.http.get(environment.basurl + 'apis/listecoursepanier');
    }

    getCourseByperiode(data) {

        return this.http.post(environment.basurl + 'apis/liste', data)
        .pipe(map(data => {
            return data;
        })).toPromise();
    }

    updatestatus1affect(idaffect, data) {

        return this.http.put(environment.basurl + 'api/affectationcourses/' + idaffect, data);
    }

    annulercourseaffect(idaffect, data) {

        return this.http.put(environment.basurl + 'api/affectationcourses/' + idaffect, data);
    }

    updatestatus2affect(idaffect, status2) {

        return this.http.put(environment.basurl + 'api/affectationcourses/' + idaffect, status2);
    }

    updateheurcourseclient(courseclient, heur) {

        return this.http.put(environment.basurl + 'api/course_clients/' + courseclient, heur);
    }

    updatecourse(idcourse, data) {

        return this.http.put(environment.basurl + 'api/courses/' + idcourse, data);
    }

    getCoursebyId(id) {
        return this.http.get(environment.basurl + 'api/courses/' + id);
    }

    getcoursebyId(id) {
        return this.http.get(environment.basurl + 'api/courses/' + id)
        .pipe(map(data => {
            return data;
        })).toPromise();
    }

    statstique(id) {
        return this.http.get(environment.basurl + 'apis/statistique/' + id);
    }

    statstiquechauffeur(data) {
        return this.http.post(environment.basurl + 'apis/rapportchauffeur', data);
    }

    getcourseByIdemployeefinal(id) {

        return this.http.get(environment.basurl + 'apis/courseemploye/' + id);
    }

    getaffectionbycouse(idaffect) {

        return this.http.get(environment.basurl + 'api/affectationcourses/' + idaffect);
    }

    addcourse(data) {

        return this.http.post(environment.basurl + 'apis/addcourse', data, {observe: 'response'});
    }

    detailcourse(idcourse) {
        return this.http.get(environment.basurl + 'apis/detailscourse/' + idcourse)
        .pipe(map(data => {
            return data;
        })).toPromise();
    }

    getcourseterminer(data) {
        return this.http.post(environment.basurl + 'apis/lisetcoursepardatepasse', data)
        .pipe(map(data => {
            return data;
        })).toPromise();
    }

    terminercourse(data) {

        return this.http.post(environment.basurl + 'apis/fileupload', data);
    }

    getnewaffectation(data) {
        return this.http.post(environment.basurl + 'apis/liste', data);
    }

    updateaffectation(id, data) {
        return this.http.put(environment.basurl + 'api/affectationcourses/' + id, data);
    }

    updatecourseadmin(data) {

        return this.http.post(environment.basurl + 'apis/modifiercourse', data);
    }

    typecc(id) {
        return this.http.get(environment.basurl + 'api/typeclients/' + id);
    }

    getLatLan(address: string) {
        const geocoder = new google.maps.Geocoder();
        return Observable.create(observer => {
            geocoder.geocode({'address': address}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    observer.next(results[0].geometry.location);
                    observer.complete();
                } else {
                    observer.next({'err': true});
                    observer.complete();
                }
            });
        });
    }

    downloadFile(filename): any {
        return this.http.get('http://vps.innoyaservices.fr/img/' + filename, this.optionRequete);
    }

    addTrajetClient(data:any) {
        return this.http.post(environment.basurl + 'apis/ajoutrajet', data)
        .pipe(map(data => {
            return data;
        })).toPromise();
    }
}
