import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthentificationService} from '../services/authentification.service';
import {DatePicker} from '@ionic-native/date-picker/ngx';
import * as moment from 'moment';


@Component({
    selector: 'app-inscription',
    templateUrl: './inscription.page.html',
    styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {

    submittedinscription = false;

    inscriptionform: FormGroup;
    userconnectee = '' || JSON.parse(localStorage.getItem('user connected'));
    myDateNTime = ' Date De Naissance ';
    myDateNaissance;

    constructor(private datePicker: DatePicker, private navController: NavController, private fb: FormBuilder, private authentification: AuthentificationService, private toastCtrl: ToastController) {
    }


    ngOnInit() {
        this.inscriptionform = new FormGroup({
            mail: new FormControl('',
                {validators: [Validators.required, Validators.email]}
            ),
            tel: new FormControl('',
                {validators: [Validators.required]}
            ), nom: new FormControl('',
                {validators: [Validators.required]}
            ), prenom: new FormControl('',
                {validators: [Validators.required]}
            ), adresse: new FormControl('',
                {validators: [Validators.required]}
            ), password: new FormControl('',
                {validators: [Validators.required]}
            )
        });

    }

    async presentToast(msg) {
        const toast = await this.toastCtrl.create({
            message: msg,
            mode: 'ios',
            color: 'danger',
            duration: 1000,
            position: 'top',
        });

        toast.present();
    }

    async presentToastsucces(msg) {
        const toast = await this.toastCtrl.create({
            message: msg,
            mode: 'ios',
            color: 'tertiary',
            duration: 1000,
            position: 'top',
        });

        toast.present();
    }

    back() {
        this.navController.back();
    }

    public inscription(): void {

        // console.log(this.inscriptionform.value);
        this.submittedinscription = true;

        // stop here if form is invalid
        if (this.inscriptionform.invalid) {

            return;
        }
        const data = {
            nom: this.inscriptionform.value.nom,
            prenom: this.inscriptionform.value.prenom,
            tel: this.inscriptionform.value.tel,
            mail: this.inscriptionform.value.mail,
            adresse: this.inscriptionform.value.adresse,
            typeemploye: '/api/typeemployes/10',
            // dateNais: this.myDateNaissance,
            active: 'false'
        };

        this.authentification.inscription(data).subscribe((res1: any) => {
                const datauser = {
                    employe: res1['body']['id'],
                    nom: this.inscriptionform.value.nom,
                    prenom: this.inscriptionform.value.prenom,
                    tel: this.inscriptionform.value.tel,
                    mail: this.inscriptionform.value.mail,
                    adresse: this.inscriptionform.value.adresse,
                    password: this.inscriptionform.value.password
                };
                this.authentification.inscriptionchauffeur(datauser).subscribe((res: any) => {
                    // console.log('succès' + res);
                    if (res.erreur && res.erreur === 'email existe') {
                        // console.log('email' + res);
                        this.presentToast(' Un compte est déjà enregistré avec votre adresse e-mail. Veuillez vous connecter !');
                    } else {
                        // console.log('succès' + res);

                        this.presentToastsucces('Votre demmande est envoyée avec succès ');
                        this.inscriptionform.reset();
                        this.submittedinscription = false;
                        this.navController.navigateForward('/login');
                    }
                });
                // console.log(res, 'inscription');

            },
            error => {
                this.presentToast('une erreur s\'est produite!');
            });


    }

    // showDateTimepicker() {
    //     this.datePicker.show({
    //         date: new Date(),
    //         mode: 'date',
    //         maxDate: new Date(new Date().setDate(new Date().getDate())).valueOf(),
    //         androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
    //         doneButtonLabel: 'Save Date & Time',
    //         is24Hour: true
    //     }).then(
    //         dateTime => {
    //
    //             this.myDateNTime = moment(dateTime).format('YYYY-MM-DD');
    //             this.myDateNaissance = moment(dateTime).format('YYYY-MM-DD');
    //
    //
    //         },
    //         err => console.log('Error occurred while getting dateTime: ', err)
    //     );
    // }

    public focusInput(event): void {

        let total = 0;
        let container = null;

        const _rec = (obj) => {

            total += obj.offsetTop;
            const par = obj.offsetParent;
            if (par && par.localName !== 'ion-content') {
                _rec(par);
            } else {
                container = par;
            }
        };
        _rec(event.target);
        container.scrollToPoint(0, total - 50, 400);
    }
}
