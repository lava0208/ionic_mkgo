import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import {MenuController, NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';




import * as moment from 'moment';

import {Geolocation} from '@ionic-native/geolocation/ngx';
import {ClientService} from './services/client.service';
import {CourseService} from './services/course.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import {BackbuttonService} from './services/backbutton.service';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {UserService} from './services/user.service';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import {EventsService} from 'src/app/services/events.service';
import { Subject } from 'rxjs';


declare var window: {plugins: {
    impacTracking: {
        canRequestTracking: (callback: (result: boolean) => void) => void,
        trackingAvailable: (callback: (result: boolean) => void) => void
        requestTracking: (info: string | undefined, callback: (result: boolean) => void, errorCallback: (error: any) => void) => void
    }
}};

interface TrackingRequestInfo {
    primaryColor: string;
    secondaryColor: string;
    onPrimaryColor: string;
    onSecondaryColor: string;
    title: string;
    text?: string;
    subText: string;
    buttonTitle: string;
    reasons: TrackingRequestReason[];
}

interface TrackingRequestReason {
    text: string;
    image: string;
    tintImage: boolean;
}

interface Notifications {
    id: number;
    text: string;
}

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
    clickSub: any;
    user:any


    tabrouting: any[] = [{
        tab: 'home',
        iconName: 'calendar',
        label: 'Planning', route: true

    }, {
        tab: 'pickup',
        iconName: 'add-circle',
        label: 'Ajouter Course',

    }, {
        tab: 'inbox',
        iconName: 'stats',
        label: 'Rapport',
    },

        {
            tab: 'version',
            iconName: 'information-circle',
            label: ' À Propos',
        }, {
            tab: 'login',
            iconName: 'log-out',
            label: 'Déconnexion',
            route: true
        }

    ];



    employeeid;
    data;
    listnew = [];
    listcoursenew = [];
    listaffectannuler = [];
    userconnectee;
    dispatcher;

    localNotificationupdatesArray = [];
    localNotificationaffectsArray = [];
    localNotificationannulationsArray = [];
    typechauffeur;

    constructor(
        private geolocation: Geolocation,
        private router: Router,
       // public events: Events,
        private clientservice: ClientService,
        private courseServices: CourseService,
        private androidPermissions: AndroidPermissions,
        private locationAccuracy: LocationAccuracy,
        private platform: Platform,
        public navCtrl: NavController,
        private splashScreen: SplashScreen, 
        private userservices: UserService,
        private statusBar: StatusBar, 
        private storageService: StorageService,
        private localNotifications: LocalNotifications,
        private localNotifications1: LocalNotifications,
        private localNotifications2: LocalNotifications,
        private backButtonService: BackbuttonService,
        private menuCtrl: MenuController,
        public events: EventsService,
    ) {
        alert('AAA');
        this.initializeApp();

        this.events.subscribe('user:created', (user) => {
            console.log('Welcome', user);
            this.user=user.user;
          });
       /* this.storageService.get('fileprofile').then(result => {
            this.image = result;
        });

        this.employeeid = localStorage.getItem('user');
        setInterval(() => {
            this.getcourseByIdemployeefinal(localStorage.getItem('user'));
            this.notifupdatecourse(localStorage.getItem('user'));
            this.notifannulaffect(localStorage.getItem('user'));
        }, 30000);
*/
    }


    async ngOnInit() {

        // Clear Storage
        //init storage
        //await this.storageService.init();
        //await this.storageService.clear();
        
        //init storage
        await this.storageService.init();
        this.user = JSON.parse(await this.storageService.get('currentClientUser'));
        console.log('currentClientUser', this.user);

        //this.getonedispatcher();
    }

    getonedispatcher() {
        this.clientservice.getonedispatcher().subscribe(res => {
            console.log('disp', res);
            this.dispatcher = res[0];
        });
    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log("oki")
            alert('AAA222');

           this.hideSplashScreen();
            
            this.statusBar.styleBlackTranslucent();
            this.backButtonService.init();

            this.checkGPSPermission();




            if (this.platform.is('cordova')) {
    
                if (this.platform.is('android')) {
                 /* this.oneSignal.startInit('add08ec4-c216-4499-8c5c-1d69c14c4c58', '434529214363');
                  this.oneSignal.enableSound(true);
                  this.oneSignal.enableVibrate(true);*/

              
                }
                if (this.platform.is('ios')) {
                    console.log("oki2")

                    const raison:TrackingRequestReason = {
                        text: 'test',
                        image: 'test',
                        tintImage: false
                    }

                    const obj:TrackingRequestInfo = {
                        primaryColor: '#000000',
                        secondaryColor: '#000000',
                        onPrimaryColor: '#000000',
                        onSecondaryColor: '#000000',
                        title: 'test',
                        text: 'test',
                        subText: 'test',
                        buttonTitle: 'test',
                        reasons: [raison]
                    };

                    // Tracking request
                    this.request(obj)

                }
              }
        
              /*this.oneSignal.clearOneSignalNotifications();
        
              this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
          
              this.oneSignal.handleNotificationReceived().subscribe(async (data) => {
        
                      alert(data.payload.body)
                          
                      console.log('handleNotificationReceived', data);
                      let obj = JSON.parse(data.payload.title);
        
        
                      const navigationExtras: NavigationExtras = {
                        queryParams: {
                            obj
                        },
                      };

                    //event refresh home
                    this.events.publish('user:refresh', {
                        user: true,
                        //time: new Date()
                    });

                      this.router.navigateByUrl('/tabs/detailcourse/' + obj.course);

              });
          
              this.oneSignal.handleNotificationOpened().subscribe(async (data) => {
        
                alert(data.notification.payload.body)

                          
                console.log('handleNotificationReceived', data);
                let obj = JSON.parse(data.notification.payload.title);
        
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        obj
                    },
                  };

                //event refresh home
                this.events.publish('user:refresh', {
                user: true,
                //time: new Date()
                });

                  this.router.navigateByUrl('/tabs/detailcourse/' + obj.course);

              });
        
              this.oneSignal.endInit();

              console.log('onesignal ok *****')*/


        });

    }

    // Tracking
    private async request(info: TrackingRequestInfo | undefined): Promise<boolean> {
        const sub = new Subject<boolean>();
        window.plugins.impacTracking.requestTracking(JSON.stringify(info), (result) => {
            sub.next(result);
            sub.complete();
        }, (error) => {
            alert(JSON.stringify(error));
            console.log(error);
            sub.next(false);
            sub.complete();
        });
        return sub.toPromise();
    } 

    goPage(p)
    {
      let routeFragment = '/'+p;
      this.router.navigateByUrl(routeFragment, {replaceUrl: true});
      this.menuCtrl.close();
    }


    hideSplashScreen() {
        if (this.splashScreen) {
            setTimeout(() => {
                this.splashScreen.hide();
            }, 300);
        }
    }


    getcourseByIdemployeefinal(id) {
        // console.log('affectation', id);
        const data = {
            'employe': id
        };

        this.courseServices.getaffectnotif(data).subscribe((res: any) => {
            this.data = res;

            // console.log('res', res);
            for (let i = 0; i < res.length; i++) {

                if (moment(new Date(), 'YYYY-MM-DDTH:mm').diff(moment(res[i]['affectedAt'], 'YYYY-MM-DDTH:mm')) / 60000 < 20 && moment(new Date(), 'YYYY-MM-DDTH:mm').diff(moment(res[i]['affectedAt'], 'YYYY-MM-DDTH:mm')) / 60000 > 0
                    && res[i]['view'] === null &&
                    res[i]['status1'] === '0') {


                    this.listnew.push(res[i]);


                }

            }

            this.multi_notification(this.listnew);

            this.listnew = [];

        });


    }

    notifupdatecourse(id) {

        const data = {
            'employe': id
        };

        this.courseServices.getaffectnotif(data).subscribe((res: any) => {
            this.data = res;


            for (let i = 0; i < res.length; i++) {
                if (res[i]['course']['modifierle']) {

                    if (moment(new Date(), 'YYYY-MM-DDTH:mm').diff(moment(res[i]['course']['modifierle'], 'YYYY-MM-DDTH:mm')) / 60000 < 20 && moment(new Date(), 'YYYY-MM-DDTH:mm').diff(moment(res[i]['course']['modifierle'], 'YYYY-MM-DDTH:mm')) / 60000 > 0
                        && res[i]['course']['view'] === null && res[i]['status1'] !== '2' && res[i]['status1'] !== '3') {


                        this.listcoursenew.push(res[i]);


                    }
                }


            }


            this.multi_notificationupdatecours(this.listcoursenew);


            this.listcoursenew = [];

        });

    }

    notifannulaffect(id) {

        const data = {
            'employe': id
        };

        this.courseServices.getaffectnotif(data).subscribe((res: any) => {
            this.data = res;
            for (let i = 0; i < res.length; i++) {
                if (res[i]['annulerle']) {

                    if (moment(new Date(), 'YYYY-MM-DDTH:mm').diff(moment(res[i]['annulerle'], 'YYYY-MM-DDTH:mm')) / 60000 < 20 && moment(new Date(), 'YYYY-MM-DDTH:mm').diff(moment(res[i]['annulerle'], 'YYYY-MM-DDTH:mm')) / 60000 > 0
                        && res[i]['view'] === null) {


                        this.listaffectannuler.push(res[i]);


                    }
                }

            }
            this.multi_notificationannuler(this.listaffectannuler);

            this.listaffectannuler = [];

        });


    }

    async logout()
    {
      await this.storageService.clear();
      this.router.navigateByUrl('/login', { replaceUrl: true });
      this.menuCtrl.close();
    }


    multi_notification(listaff1) {
        console.log('apres   Affectation', listaff1);
        if (listaff1.length > 0) {
            listaff1.forEach(data => {
                this.localNotificationaffectsArray.push({
                    id: new Date(data.affectedAt).getTime()
                    ,
                    text: data['course']['courseClients'][0].depart +
                        '===>' + data['course']['courseClients'][0].destination,
                    title: 'Nouvelle Affectation id course:' + data.course.id,
                    lockscreen: true,
                    vibrate: true,
                    data: data
                });
            });
            this.localNotifications.cancelAll().then(() => {
                this.localNotifications.schedule(this.localNotificationaffectsArray);
            });
            console.log('Nouvelle Affectation', this.localNotificationaffectsArray);
            this.localNotifications.on('click').subscribe(notification => {
                this.viewaffectation(notification.data);
            });


        }
    }

    multi_notificationannuler(listaff) {
        if (listaff.length > 0) {
            listaff.forEach(data => {
                this.localNotificationannulationsArray.push({
                    id: new Date(data.annulerle).getTime(),
                    text: data['course']['courseClients'][0].depart +
                        '===>' + data['course']['courseClients'][0].destination,
                    title: 'Affectation Annulée id course:' + data.course.id,
                    lockscreen: true,
                    vibrate: true,
                    data: data
                });

            });
            this.localNotifications1.cancelAll().then(() => {
                this.localNotifications1.schedule(this.localNotificationannulationsArray);
            });
            console.log('Affectation Annuler', this.localNotificationannulationsArray);
            this.localNotifications1.on('click').subscribe(notification => {
                this.viewaffectation(notification.data);
            });

        }
    }

    multi_notificationupdatecours(listcourse) {
        // console.log('apres  test update', listcourse);
        if (listcourse.length > 0) {

            listcourse.forEach(data => {
                this.localNotificationupdatesArray.push({
                    id: new Date(data.course.modifierle).getTime(),
                    text: data['course']['courseClients'][0].depart +
                        '===>' + data['course']['courseClients'][0].destination,
                    title: 'Modification Course id course:' + data.course.id,
                    lockscreen: true,
                    vibrate: true,
                    data: data
                });
            });
            this.localNotifications2.cancelAll().then(() => {
                this.localNotifications2.schedule(this.localNotificationupdatesArray);
            });
            console.log('Modification Course ', this.localNotificationupdatesArray);
            this.localNotifications2.on('click').subscribe(notification => {
                this.viewModifcourse(notification.data);
            });

        }
    }

    ionViewDidLoad() {
        this.checkGPSPermission();
    }

    getemployeebyid() {
        this.clientservice.getemployeebyId(localStorage.getItem('user')).then(res => {
            console.log('app.ts', res);
            this.userconnectee = res;
        });
    }

    viewaffectation(aff) {
        this.courseServices.updateaffectation(aff.id, {'view': '1'}).subscribe((res: any) => {
            console.log('view affectation et annulaation', res.view);
            // this.router.navigateByUrl('/tabs/detailcourse/' + aff.course.id);
            this.navCtrl.navigateRoot('/tabs/detailcourse/' + aff.course.id);
        });
    }

    viewModifcourse(aff) {
        this.courseServices.updatecourse(aff.course.id, {'view': '1'}).subscribe((res: any) => {
            console.log('viewModifcourse', res.view);
            this.navCtrl.navigateRoot('/tabs/detailcourse/' + aff.course.id);
        });
    }

    showtabLabel(root) {

        if (root === 'home') {
            console.log(this.typechauffeur);
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    typechauffeur: localStorage.getItem('typeChauffeur')
                }
            };

            this.navCtrl.navigateForward(['/tabs/home'], navigationExtras);

        } else if (root === 'login') {
            this.logout();
        }
    }

    checkGPSPermission() {

        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
            result => {
                if (result.hasPermission) {

                    // If having permission show 'Turn On GPS' dialogue
                    this.askToTurnOnGPS();
                } else {

                    // If not having permission ask for permission
                    this.requestGPSPermission();
                }
            },
            err => {
                console.log('checkGPSPermission',err);
            }
        );
    }

    requestGPSPermission() {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
                console.log('4');
            } else {
                // Show 'GPS Permission Request' dialogue
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
                    .then(
                        () => {
                            // call method to turn on GPS
                            this.askToTurnOnGPS();
                        },
                        error => {
                            // Show alert if user click on 'No Thanks'
                            alert('requestPermission Error requesting location permissions ' + error);
                        }
                    );
            }
        });
    }

    askToTurnOnGPS() {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
                // When GPS Turned ON call method to get Accurate location coordinates
                this.getLocationCoordinates();
            },
            error => alert('Error requesting location permissions ' + JSON.stringify(error))
        );
    }

    getLocationCoordinates() {
        this.geolocation.getCurrentPosition().then((resp) => {
            const data = {'latitude': resp.coords.latitude.toString(), 'longitude': resp.coords.longitude.toString()};
            this.userservices.updateuserr(localStorage.getItem('userid'), data).then(res => {
                console.log('resupdate', res);
            });

        });
    }
}
