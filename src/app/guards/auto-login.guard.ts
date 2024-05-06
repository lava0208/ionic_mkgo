import {Injectable} from '@angular/core';


import {NavController} from '@ionic/angular';
import {CanLoad, NavigationExtras, Router} from '@angular/router';
import {ClientService} from '../services/client.service';

@Injectable({
    providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
    userconnectee;

    constructor(private router: Router, private clientservice: ClientService,
                public navCtrl: NavController) {
        localStorage.getItem('user');


    }

    async canLoad(): Promise<boolean> {
        const hasSeenIntro = await localStorage.getItem('user');
        if (hasSeenIntro !== null) {
            this.clientservice.getemployeebyId(localStorage.getItem('user')).then((res: any) => {
                console.log('autologin.ts', res);
                this.userconnectee = res;
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        image: res.filename,
                        nom: res.nom,
                        prenom: res.prenom,
                        typechauffeur: res['typechauffeur']

                    }
                };

                this.navCtrl.navigateForward(['/tabs/home'], navigationExtras);

            });

        } else {
            return true;
        }
    }
}
