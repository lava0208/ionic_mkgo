import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController, NavController, ToastController} from '@ionic/angular';
import {NavigationExtras, Router} from '@angular/router';
import {Location} from '@angular/common';
import * as moment from 'moment';
import {UserService} from '../services/user.service';

import {ClientService} from '../services/client.service';
import { StorageService } from '../services/storage/storage.service';


@Component({
    selector: 'app-reclamation',
    templateUrl: './reclamation.page.html',
    styleUrls: ['./reclamation.page.scss'],
})
export class ReclamationPage implements OnInit {
    submitted;
    registerForm: FormGroup;
    userloged;

    user:any;
    isLoaded = false;

    constructor(
        private clientService: ClientService,
        private toastCtrl: ToastController,
        public navCtrl: NavController,
        private location: Location,
        public modalCtrl: ModalController,
        private formBuilder: FormBuilder,
        private router: Router,
        private userservice: UserService,
        private storageService: StorageService,

               ) {
    }

    async ngOnInit() {


        this.registerForm = this.formBuilder.group({
            remarque: ['', Validators.required]
        });
        //init storage
        await this.storageService.init();
        //init storage
        this.user = JSON.parse(await this.storageService.get('currentClientUser'));
        console.log('currentClientUser', this.user)
        if(this.user && this.user.id)
        {
            this.clientService.getusersbyId(this.user.id.toString()).subscribe(res => {

                this.userloged = res;
                this.isLoaded = true;

            });

        }
        else
        {
            this.isLoaded = false;
        }
    }

    cancel() {
        this.location.back();
    }

    ionViewWillEnter(){
        this.registerForm.reset()
    }


    get f() {
        return this.registerForm.controls;
    }


    addreclamation() {
        this.submitted = true;


        if (this.registerForm.invalid) {
            return;
        }

        const remarque = {
            employe: '/api/employes/' + this.user.employe.split('/')[3],
            creerpar: '/api/users/' + this.user.id.toString(),
            date: moment(new Date()).format('YYYY-MM-DDTH:mm'),
            status: 'en traitement',
            remarque: this.registerForm.value['remarque']
        };
        this.userservice.addremarque(remarque).subscribe(res => {

            this.presentToastsucces('Votre Remarque envoyée avec succès ');

            this.navCtrl.navigateForward(['/tabs/home']);


        });
        this.submitted = false;
        this.registerForm.reset();
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
}
