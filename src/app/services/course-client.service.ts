import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CourseClientService {

    constructor(private http: HttpClient) {
    }

    getCourseClientById(id) {

        return this.http.get(environment.basurl + 'api/course_clients/' + id);
    }
    delleteCourseClientById(id) {

        return this.http.delete(environment.basurl + 'api/course_clients/' + id);
    }
    getcouseclientbycourse(idcourse) {
        return this.http.get(environment.basurl + 'apis/coursesclientbycourse/' + idcourse);
    }
}
