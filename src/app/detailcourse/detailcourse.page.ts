import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, Platform, PopoverController, ToastController} from '@ionic/angular';
import {CourseClientService} from '../services/course-client.service';
import {ClientService} from '../services/client.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {CourseService} from '../services/course.service';
import {UpdatestatusComponent} from '../updatestatus/updatestatus.component';
import {ConfirmcourseterminerComponent} from '../confirmcourseterminer/confirmcourseterminer.component';

import {Geolocation} from '@ionic-native/geolocation/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import {UserService} from '../services/user.service';
import * as moment from 'moment';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import {LaunchNavigator, LaunchNavigatorOptions} from '@awesome-cordova-plugins/launch-navigator/ngx';
import { StorageService } from '../services/storage/storage.service';
import { EventsService } from '../services/events.service';


declare var google;
import 'moment-timezone';

@Component({
    selector: 'app-detailcourse',
    templateUrl: './detailcourse.page.html',
    styleUrls: ['./detailcourse.page.scss'],
})
export class DetailcoursePage implements OnInit {

    user:any;
    isLoaded = false;

    newaffecta;
    date: any;
    time: any;

    lat: number;
    lng: number;
    destLoc: any;
    rideData: any;

    userconnectee;
    clientIds;
    dispatcher;
    course;

    status2;
    idaffect;
    client: Object;
    today = new Date().setHours(0, 0, 0, 0);
    datcourse;
    employeeid;

    userloged;

    block;
    street;
    building;
    flag;
    pickup;
    des_Lat;
    des_Lng;

    constructor(
            private popoverController: PopoverController,
            private androidPermissions: AndroidPermissions,
            private userservices: UserService,
            private geolocation: Geolocation,
            private locationAccuracy: LocationAccuracy,
            @Inject(LaunchNavigator) private launchNavigator: LaunchNavigator,
            public loadingCtrl: LoadingController,
            private clipboard: Clipboard,
            private courseClient: CourseClientService,
            private clientService: ClientService,
            private router: Router, private __zone: NgZone,
            public alertCtrl: AlertController,
            private courseService: CourseService,
            private toastController: ToastController,
            public actvroute: ActivatedRoute,
            public route: Router,
            private storageService: StorageService,
            private clientservice: ClientService,
            public navCtrl: NavController,
            public events: EventsService,
            private platform: Platform,

        ) {

        this.actvroute.params.subscribe(params => {
            this.rideData = params.id;
            console.log('idCourse',this.rideData);
        });
    }

    async ngOnInit() {

        var locale = 'fr-ca';
        moment.locale(locale);

        //init storage
        await this.storageService.init();
        //init storage
        this.user = JSON.parse(await this.storageService.get('currentClientUser'));
        console.log('currentClientUser', this.user)
        if(this.user && this.user.id)
        {
            this.employeeid = this.user.employe.split('/')[3];
            await this.getcourse(this.rideData)
        }
        else
        {
            this.isLoaded = false;
        }

        this.clientService.getonedispatcher().subscribe(res => {
            this.dispatcher = res[0];
        });
    }

        //Format Timezone
        formatTimeZone(t){
            let tf = moment(t).tz("Europe/Paris").format('HH:mm');
            return tf
        }
    
        formatTimeDateZone(t){
            let tf = moment(t).tz("Europe/Paris").format('D MMM');
            console.log('tf***',tf)
            return tf
        }

    isIos()
    {
        return (this.platform.is('ios') || this.platform.is('iphone') || this.platform.is('ipad'))
    }

    showRetourAdmin(status)
    {
        switch (status) {
            case '4':
                return false
                break;
            case '8':
                return false
                break;
            case '3':
                return false
                break;
            default:
                break;
        }
        return true
    }

    getColorStatus2(status:String)
    {
      let color = '';
      switch (status) {
          case '0':
              color = 'enattente'
              break;
          case '1':
              color = 'enroute'
              break;
          case '2':
              color = 'surplace'
              break;
          case '3':
              color = 'absent'
              break;
          case '4':
              color = 'terminer'
              break;
          case '5':
              color = 'abord'
              break;
          case '6':
              color = 'Absent'
              break;
          case '8':
              color = 'absentdep'
              break;
          default:
              break;
      }
      return color
    }


    async doRefresh(event) {
        this.isLoaded = false;
        await this.getcourse(this.rideData);
        setTimeout(() => {
            if(event && event !='null')
            event.target.complete();
        }, 500);
    }

    async getcourse(id) {
        this.isLoaded = false;
        this.courseService.detailcourse(id).then(res => {

            this.course = res;
            this.idaffect = res['affectationcourses'][0]['id'];
            this.newaffecta = res['affecta'];
            this.datcourse = new Date(res['start']).setHours(0, 0, 0, 0);
            console.log('Course',this.course);
            this.isLoaded = true;

            this.courseService.getaffectById(this.idaffect).subscribe(res1 => {


            });
        });

    }

    ionViewDidEnter() {
        this.doRefresh('null')
    }


    async openPopover(ev: Event, idaffect, status1) {
        const popover = await this.popoverController.create({
            component: UpdatestatusComponent,
            componentProps: {
                custom_id: status1 + '/' + idaffect,
            },
            event: ev
        });
        popover.onDidDismiss()
            .then(async (result) => {

                //await this.getcourse(this.rideData);
                this.doRefresh('null')

            });
        popover.present();

    }

    async openPopoverconfirmation(ev: Event, idaffect, status2) {
        const popover = await this.popoverController.create({
            component: ConfirmcourseterminerComponent,
            componentProps: {
                custom_id: status2 + '/' + idaffect,
            },
            event: ev
        });
        popover.onDidDismiss()
            .then(async (result) => {

                //await this.getcourse(this.rideData);
                this.doRefresh('null')

            });
        popover.present();
    }


    getaffectById() {
        this.courseService.getaffectById(this.idaffect).subscribe(res => {

        });
    }

    // anulation course
    async annulercourseaffecter(idaffect) {

        const alert = await this.alertCtrl.create({
            header: 'Retour admin:',

            inputs: [

                {
                    type: 'text',
                    placeholder: 'Motif de retour',
                    name: 'motifannulation'
                }

            ],
            buttons: [
                {
                    text: 'Fermer',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: status => {
                    }
                }, {
                    text: 'Enregistrer',
                    handler: (formData: { motifannulation: string }) => {
                        if (formData.motifannulation === '') {
                            if (!alert.getElementsByClassName('validation-errors').length) {
                                const input = alert.getElementsByTagName('input')[0];

                                const validationErrors = document.createElement('div');
                                validationErrors.className = 'validation-errors';

                                const errorMessage = document.createElement('small');
                                errorMessage.style.color = 'red';
                                errorMessage.textContent = 'Motif de retour Obligatoire';

                                validationErrors.appendChild(errorMessage);

                                input.insertAdjacentElement('afterend', validationErrors);
                                return false;
                            }
                        } else {
                            this.annulercourseaffect(formData.motifannulation, idaffect);
                        }
                    }
                }
            ]
        });
        return await alert.present();
    }

    async annulercourseaffect(motifannulation, idaffect) {

        const data = {
            'status1': '3',
            'status2': '6',
            'annulerpar': this.user.id.toString(),
            'annulerle': moment(new Date()).format('YYYY-MM-DDTH:mm'),
            'acceptepar': '',
            motifannulation
        };

        this.courseService.updatestatus1affect(idaffect, data).subscribe(res => {

            this.annulercours();
            this.getaffectById();
        });
        await this.geolocation.getCurrentPosition().then((resp) => {
            const options: LaunchNavigatorOptions = {
                app: this.launchNavigator.APP.WAZE,
                start: [resp.coords.latitude, resp.coords.longitude]
            };
            const datauser = {'latitude': resp.coords.latitude.toString(), 'longitude': resp.coords.longitude.toString()};
            this.userservices.updateuserr(this.user.id.toString(), datauser).then(res => {

            });

        });


    }

    annulercours() {
        const nomprenomuser = this.user.nom + ' ' + this.user.prenom;

        const newaffect = this.newaffecta.replace(nomprenomuser, '');

        const data = {'status': '0', 'backgroundcolor': '#000000', 'affecta': newaffect};

        this.courseService.updatecourse(this.rideData, data).subscribe(res => {
            this.navCtrl.navigateForward(['/tabs/home']);
            //event refresh home
            this.events.publish('user:refresh', {
                user: true,
                //time: new Date()
            });

        });
    }

    navigateLocationdest(adressedepart, adressearrive) {



        let adressedepart1 = '';
        let adressearrive1 = '';
        if (adressedepart.indexOf(':') !== -1) {
            adressedepart1 = adressedepart.split(':')[1];
        } else if (adressedepart.indexOf(':') === -1) {
            adressedepart1 = adressedepart;

        }
        if (adressearrive.indexOf(':') !== -1) {
            adressearrive1 = adressearrive.split(':')[1];
        } else if (adressearrive.indexOf(':') === -1) {
            adressearrive1 = adressearrive;
        }
        this.courseService.getLatLan(adressedepart1).subscribe(result => {
                this.__zone.run(() => {
                    this.des_Lat = result.lat();
                    this.des_Lng = result.lng();

                });

            },
            error => console.log(error),
            () => console.log('pickup completed'));

        const options: LaunchNavigatorOptions = {
            app: this.launchNavigator.APP.WAZE,
            start: adressedepart1

        };

        this.launchNavigator.navigate(adressearrive1, options)
            .then(success => {

            }, error => {

            });
    }

    async loading(message) {
        const loader = await this.loadingCtrl.create({
            message
        });
        return loader;
    }

    checkGPSPermission(adresse) {

        if (adresse.indexOf(':') !== -1) {
            adresse = adresse.split(':')[1];
        } else if (adresse.indexOf(':') === -1) {
            adresse = adresse;
        }

        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
            result => {
                if (result.hasPermission) {

                    // If having permission show 'Turn On GPS' dialogue
                    this.askToTurnOnGPS(adresse);
                } else {

                    // If not having permission ask for permission
                    this.requestGPSPermission(adresse);
                }
            },
            err => {
                alert(err);
            }
        );
    }

    requestGPSPermission(adresse) {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {

            } else {
                // Show 'GPS Permission Request' dialogue
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
                    .then(
                        () => {
                            // call method to turn on GPS
                            this.askToTurnOnGPS(adresse);
                        },
                        error => {
                            // Show alert if user click on 'No Thanks'
                            alert('requestPermission Error requesting location permissions ' + error);
                        }
                    );
            }
        });
    }

    askToTurnOnGPS(adresse) {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
                // When GPS Turned ON call method to get Accurate location coordinates
                this.getLocationCoordinates(adresse);
            },
            error => alert('Error requesting location permissions ' + JSON.stringify(error))
        );
    }



    getLocationCoordinates(adresse) {


        this.geolocation.getCurrentPosition().then((resp) => {
            const options: LaunchNavigatorOptions = {
                app: this.launchNavigator.APP.WAZE,

                start: [resp.coords.latitude, resp.coords.longitude],

            };

            const data = {'latitude': resp.coords.latitude.toString(), 'longitude': resp.coords.longitude.toString()};
            this.userservices.updateuserr(this.user.id.toString(), data).then(res => {

            });

            this.launchNavigator.navigate(adresse, options)
                .then(success => {


                }, error => {

                });
        }).catch((error) => {
            alert('Error getting location' + error);
        });
    }





}
