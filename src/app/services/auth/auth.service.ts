import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/services/storage/storage.service';

export interface UserPro{
  username: string;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private currentClientUserSubject$: BehaviorSubject<User>;
  public currentClientUser: Observable<User>;
  
  constructor(
    private http: HttpClient,
    private storageService: StorageService

  ) { 

    this.currentClientUserSubject$ = new BehaviorSubject<User>(localStorage.getItem('currentClientUser') != 'undefined'?JSON.parse(localStorage.getItem('currentClientUser')):null);

  }

  public get currentClientUserValue(): User {
    return this.currentClientUserSubject$.value;
  }


  loginauth(email, password, token){
    return this.http.post(`${environment.apiUrl}/apis/loginadmin`, { email, password, token })
    .pipe(
      map(async data => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        if(data[0])
        {
          //init storage
          this.storageService.init();
          await this.storageService.set('currentClientUser',JSON.stringify(data[0]));

          this.currentClientUserSubject$.next(data[0]);
        }
        return data;
    })).toPromise();
  }

  handleError(error: HttpErrorResponse) {

    /*if(error.error)
    {
      alert(error.error)
      return throwError(`${error.error}`);
    }*/
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
        // Server-side errors
        if(error.status)
        {
          //alert('error')
        }
        else
        {
          alert('Pas de connexion')
        }
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

    }


    return throwError(errorMessage);
  }


  logout() {
    this.resetStorage();
  }

  resetStorage()
  {
    // remove user from local storage to log user out
    localStorage.removeItem('currentClientUser');
    this.currentClientUserSubject$.next(null);
  }

}
