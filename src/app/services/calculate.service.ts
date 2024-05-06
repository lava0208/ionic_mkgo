import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Geolocation} from '@ionic-native/geolocation/ngx';


@Injectable({
    providedIn: 'root'
})
export class CalculateService {
    url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&&origins=A%C3%A9roport%20Toulouse-Blagnac%20(TLS),%20Blagnac,%20France&destinations=A%C3%A9roport%20Toulouse-Blagnac%20(TLS),%20Blagnac,%20France&mode=walking&key=AIzaSyBWnLEvgdiPhRHa-fmD6KIDO7PnaJY4cmY';
    key = 'AIzaSyBWnLEvgdiPhRHa-fmD6KIDO7PnaJY4cmY';

    constructor(private http: HttpClient, private geolocation: Geolocation) {
    }


    async caldistance(origin: string, destination: string) {

        // let latlng = [];
        //
        // await this.geolocation.getCurrentPosition().then((resp) => {
        //     // resp.coords.latitude
        //     // resp.coords.longitude
        //     console.log('lattitude and logintudes are :', resp.coords.latitude, resp.coords.longitude);
        //     latlng[0] = resp.coords.latitude;
        //     latlng[1] = resp.coords.longitude;
        //
        // }).catch((error) => {
        //     console.log('Error getting location', error);
        // });


        return await this.http.get(`${this.url}`);

        // await this.http.get('https://jsonplaceholder.typicode.com/todos/',httpOptions).subscribe(res=>{
        //   console.log(res)
        // });

    }


    async getCurrentLoc() {
        await this.geolocation.getCurrentPosition().then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude
            console.log('lattitude and logintudes are :', resp.coords.latitude, resp.coords.longitude);

        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }


}
