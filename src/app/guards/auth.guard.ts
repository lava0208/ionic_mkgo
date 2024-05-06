import {Injectable} from '@angular/core';
import {CanLoad, NavigationExtras, Router} from '@angular/router';
import {ClientService} from '../services/client.service';
import {NavController} from '@ionic/angular';
import { StorageService } from '../services/storage/storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {
    userconnectee;

    constructor(private router: Router, public storage: StorageService, private clientservice: ClientService,
                public navCtrl: NavController) {
        this.clientservice.getemployeebyId(localStorage.getItem('user')).then(res => {
            console.log('guard.ts', res);
            this.userconnectee = res;
        });

    }

    async canLoad(): Promise<boolean> {
        const hasSeenIntro = await localStorage.getItem('user');
        if (hasSeenIntro !== null) {
            return true;
        } else {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    image: this.userconnectee.filename,
                    nom: this.userconnectee.nom,
                    prenom: this.userconnectee.prenom,
                    typechauffeur: this.userconnectee.typechauffeur

                }
            };

            this.navCtrl.navigateForward(['/tabs/home'], navigationExtras);
            return false;
        }
    }


}
