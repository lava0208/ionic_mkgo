import {Component, OnInit} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {LoadingController, NavController, Platform, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageService} from '../services/storage/storage.service';
import {AuthentificationService} from '../services/authentification.service';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {UserService} from '../services/user.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {ClientService} from '../services/client.service';
import { EventsService } from 'src/app/services/events.service';


@Component({
    selector: 'app-loginform',
    templateUrl: './loginform.page.html',
    styleUrls: ['./loginform.page.scss'],
})
export class LoginformPage implements OnInit {
    isActiveToggleTextPassword: Boolean = true;
    loginForm: FormGroup;
    submitted = false;
    loading;
    loaderTimeout;

    isLoaded : Boolean = true;
    msg :String = '';

    constructor(
        public toastController: ToastController,
        private storageService: StorageService,
        public loadingController: LoadingController,
        public route: Router,
        private androidPermissions: AndroidPermissions,
        private userservices: UserService,
        public clientService: ClientService,
        private geolocation: Geolocation,
        private loginservice: AuthentificationService,
        private formBuilder: FormBuilder,
        public navCtrl: NavController,
        private platform: Platform,
        public events: EventsService
        ) {
    }

    get f() {
        return this.loginForm.controls;
    }

    async ngOnInit() {

        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        //init storage
        await this.storageService.init();
        //init storage
        let user = JSON.parse(await this.storageService.get('currentClientUser'));
        console.log('currentClientUser', user)
        if(user && user.id)
        {
        setTimeout(() => {
            this.route.navigateByUrl('/tabs/home', { replaceUrl: true });
        }, 1000);
        }else{
        this.isLoaded = false;
        }

    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Connexion en cours...',
        });
        await this.loading.present();

    }

    public toggleTextPassword(): void {
        this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword !== true);
    }

    public getType() {
        return this.isActiveToggleTextPassword ? 'password' : 'text';
    }



    async LoginUser(user:any){

        this.submitted = true;
        this.isLoaded = true;
        if (this.platform.is('ios')) {
          try{

            await this.loginservice.login(user).then( res =>{
                console.log('login***',res)
                //publish event for app componant 
                this.events.publish('user:created', {
                    user: res[0],
                    //time: new Date()
                });
                this.msg = ''
                this.isLoaded = false;
                this.submitted = false;
                this.navCtrl.navigateForward(['/tabs/home']);
            })
      
          }catch(err){
            console.log('err : ',err.error);
            this.presentToast();
            this.msg = err.error;
            this.isLoaded = false;
            this.submitted = false;
          }
        }
        else
        {
          //localhost
            await this.loginservice.login(user).then( res =>{
                console.log('login serve***',res[0]);
                //publish event for app componant 
                this.events.publish('user:created', {
                    user: res[0],
                    //time: new Date()
                });
                this.msg = '';
                this.isLoaded = false;
                this.submitted = false;
                this.navCtrl.navigateForward(['/tabs/home']);

                /*const usser = res[0].employe.toString().replace('/api/employes/', '');
                localStorage.setItem('user', usser);
                this.clientService.getemployeebyId(usser).then(res5 => {
                    localStorage.setItem('typeChauffeur', res5['typechauffeur']);
                    this.events.publish('user:created', res[0].filename, res[0].nom, res[0].prenom, res5['typechauffeur']);
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            image: res[0].filename,
                            nom: res[0].nom,
                            prenom: res[0].prenom,
                            typechauffeur: res5['typechauffeur']

                        }
                    };
                    this.storageService.set('fileprofile', res[0].filename);
                    localStorage.setItem('userid', res[0].id);
                    this.storageService.set('nom', res[0].nom);
                    this.storageService.set('prenom', res[0].prenom);
                    this.navCtrl.navigateForward(['/tabs/home'], navigationExtras);
                });*/


                /*this.geolocation.getCurrentPosition().then((resp) => {
                    const data1 = {'latitude': resp.coords.latitude.toString(), 'longitude': resp.coords.longitude.toString()};
                        this.userservices.updateuserr(localStorage.getItem('userid'), data1).subscribe(res1 => {
                    });

                });*/
          }).catch((err)=>{
            console.log('err : ',err.error);
            this.presentToast();
            this.msg = err.error;
            this.isLoaded = false;
            this.submitted = false;
          })
        }
      }

    /*async login() {
        this.storageService.clear();
        this.submitted = true;
        const data = {
            email: this.loginForm.value['email'],
            tocken: '1234565',
            password: this.loginForm.value['password'],
        };
        if (this.loginForm.invalid) {


            return;
        }

        await this.loginservice.login(data).then(res => {
                this.storageService.clear();
                const usser = res[0].employe.toString().replace('/api/employes/', '');
                localStorage.setItem('user', usser);
                this.clientService.getemployeebyId(usser).then(res5 => {
                    localStorage.setItem('typeChauffeur', res5['typechauffeur']);
                    this.events.publish('user:created', res[0].filename, res[0].nom, res[0].prenom, res5['typechauffeur']);
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            image: res[0].filename,
                            nom: res[0].nom,
                            prenom: res[0].prenom,
                            typechauffeur: res5['typechauffeur']

                        }
                    };
                    this.storageService.set('fileprofile', res[0].filename);
                    localStorage.setItem('userid', res[0].id);
                    this.storageService.set('nom', res[0].nom);
                    this.storageService.set('prenom', res[0].prenom);
                    this.navCtrl.navigateForward(['/tabs/home'], navigationExtras);
                });


                this.geolocation.getCurrentPosition().then((resp) => {
                    const data1 = {'latitude': resp.coords.latitude.toString(), 'longitude': resp.coords.longitude.toString()};

                    this.userservices.updateuserr(localStorage.getItem('userid'), data1).subscribe(res1 => {

                    });

                });


            }

            , error2 => {

                // this.loaderTimeout = setTimeout(() => {
                //     this.hideLoader();
                // }, 1000);

                this.presentToast();
            }
        );

    }*/

    getemployeebyid(id) {

        this.clientService.getemployeebyId(id).then(res5 => {

            localStorage.setItem('typeChauffeur', res5['typechauffeur']);
        });
    }

    hideLoader() {
        if (this.loading != null) {
            this.loading.dismiss();
            this.loading = null;
        }

        // cancel any timeout of the current loader
        if (this.loaderTimeout) {
            clearTimeout(this.loaderTimeout);
            this.loaderTimeout = null;
        }
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Email ou mot de passe incorrect!',
            duration: 2000
        });
        toast.present();
    }

}
