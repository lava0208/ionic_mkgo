import {Injectable} from '@angular/core';
import {AlertController, NavController, Platform, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class BackbuttonService {

    private lastTimeBackButtonWasPressed = 0;
    private timePeriodToAction = 2000;

    init() {
        this.platform.backButton.subscribeWithPriority(10, async () => {
            const currentUrl = this.router.url;
            if (currentUrl === '/tabs/home') {
                this.withAlert('Voulez-vous quitter l\'application?', () => {
                    navigator['app'].exitApp();
                });
                // this.withDoublePress('Press again to exit', () => {
                //     navigator['app'].exitApp();
                // });
            } else {
                this.navControlelr.back();
            }

        });
    }

    async withDoublePress(message: string, action: () => void) {
        const currentTime = new Date().getTime();

        if (currentTime - this.lastTimeBackButtonWasPressed < this.timePeriodToAction) {
            action();
        } else {
            const toast = await this.toastController.create({
                message: message,
                duration: this.timePeriodToAction
            });

            await toast.present();

            this.lastTimeBackButtonWasPressed = currentTime;
        }
    }

    async withAlert(message: string, action: () => void) {
        const alert = await this.alertController.create({
            message: message,
            buttons: [{
                text: 'Non',
                role: 'cancel'
            },
                {
                    text: 'Oui',
                    handler: action
                }]
        });

        await alert.present();
    }

    constructor(private platform: Platform,
                private router: Router,
                private navControlelr: NavController,
                private alertController: AlertController,
                private toastController: ToastController) {
    }

}
