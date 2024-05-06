import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ModalpagePage} from '../modalpage/modalpage.page';

import {AlertController, ModalController, PopoverController, ToastController} from '@ionic/angular';
import {CourseClientService} from '../services/course-client.service';
import {ClientService} from '../services/client.service';
import {CourseService} from '../services/course.service';
import {UpdatefromhomeComponent} from '../updatefromhome/updatefromhome.component';
import * as moment from 'moment';
import '../../assets/bootstrap.min.css';
import {UpdatestatusfromhomeComponent} from '../updatestatusfromhome/updatestatusfromhome.component';
import {DatePicker} from '@ionic-native/date-picker/ngx';

import {Clipboard} from '@ionic-native/clipboard/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';

import {DatePipe} from '@angular/common';
import {AffectationService} from '../services/affectation.service';
import { StorageService } from '../services/storage/storage.service';
import { UserService } from '../services/user.service';
import { EventsService } from '../services/events.service';
import 'moment-timezone';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
    user:any;
    segmenValue = 'Aujourdhui';
    rideDetails: any;
    routerSubscription: any = null;
    public data;
    depart;
    destination;
    filter = '';
    tel;
    starttime;
    course;
    employeeid;

    list = [
        {'value': '2', 'text': 'medical'},
        {'value': '1', 'text': 'taxi'},
        {'value': '4', 'text': 'eleves'},

    ];
    public loading: any;
    show = false;
    dispatcher;
    nom;
    prenom;
    image;
    userconnectee;
    courseclientpasse;
    dataterminer;

    currentPage = 1;
    currentPage1 = 1;
    itemsPerPage = 20;
    itemsPerPage1 = 10;
    pageSize: number;
    pageSize1: number;
    offset;

    userid;
    typecourse = '';
    myDateNTime;
    datechoisi = false;
    mindate = new Date().setDate(new Date().getDate());
    typeChauffeur;
    isLoaded = false;
    paginationViewer:Boolean = false

    isEnter:Boolean = false;

    constructor(
        private courseClientService: CourseClientService,
        private toastController: ToastController,
        private clientService: ClientService,
        public modalController: ModalController,
        public alertCtrl: AlertController,
        private affectationservices: AffectationService,
        private clientservice: ClientService,
        public datepipe: DatePipe,
        private courseService: CourseService,
        private activatedRoute: ActivatedRoute,
        private popoverController: PopoverController,
        private clipboard: Clipboard,
        public router: Router,
        private datePicker: DatePicker,
        private storageService: StorageService,
        private geolocation: Geolocation,
        private userservices: UserService,
        public events: EventsService,


    ) {
        this.events.subscribe('user:refresh', (user) => {
            console.log('refresh', user);
            this.isEnter = true
          });

    }

    async ngOnInit() {

        var locale = 'fr-ca';
        moment.locale(locale);
        
        this.segmenValue = 'Aujourdhui';

        //init storage
        await this.storageService.init();
        //init storage
        this.user = JSON.parse(await this.storageService.get('currentClientUser'));
        console.log('currentClientUser', this.user)
        if(this.user && this.user.id)
        {
            await this.getcourseByIdemployeefinal1(this.filter, 'Aujourdhui');
            this.offset = new Date().getTimezoneOffset();
        }
        else
        {
            this.isLoaded = false;
        }

        this.getonedispatcher();
    }
    //Format Timezone
    formatTimeZone(t){
        let tf = moment(t).tz("Europe/Paris").format('HH:mm');
        return tf
    }

    formatTimeDateZone(t){
        let tf = moment(t).tz("Europe/Paris").format('D MMM');
        return tf
    }

    ionViewWillEnter(){
        console.log('isEnter',this.isEnter)
        if(this.isEnter)
        {
            this.doRefresh(null);
        }
    }

    showDateTimepicker(event) {
        if (this.myDateNTime !== '') {
            this.myDateNTime = '';
            this.getcourseterminer1(this.filter, '');
        } else {

            this.datePicker.show({
                date: new Date(),
                mode: 'date',
                maxDate: new Date(this.mindate).getTime() || '',
                allowOldDates: false,
                doneButtonLabel: 'Ok',
                doneButtonColor: '#F2F3F4',
                cancelButtonLabel: 'Annuler',
                cancelButtonColor: '#000000',
                androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
                is24Hour: true
            }).then(
                dateTime => {
                    this.myDateNTime = moment(dateTime).format('YYYY-MM-DD');
                    event.target.value = dateTime;
                    this.datechoisi = true;
                    this.getcourseterminer1(this.filter, this.myDateNTime);
                },
                err => console.log('Error occurred while getting dateTime: ', err)
            );
        }


    }

    showTimepicker(event, idaffect, idcourse) {

        this.datePicker.show({
            date: new Date(),
            mode: 'time',
            doneButtonLabel: 'Ok',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'Annuler',
            cancelButtonColor: '#000000',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
            is24Hour: true
        }).then(
            time => {

                this.accepteraffectation(moment(time).format('YYYY-MM-DDTH:mm'), idaffect, idcourse);


            },
            err => console.log('Error occurred while getting dateTime: ', err)
        );
    }

    async presentModal(idcourse, idaffect) {

        const modal = await this.modalController.create({
            component: ModalpagePage,
            cssClass: 'custom-modal-autreformation',
            componentProps: {
                idcourse: idcourse,
                idaffect: idaffect
            },
            mode: 'md',
            showBackdrop: false
        });


        modal.onDidDismiss()
            .then((result) => {

                this.getcourseByIdemployeefinal1(this.filter, this.segmenValue);
            });
        modal.present();
    }


    goToChat(idcours) {

        this.router.navigateByUrl('/tabs/detailcourse/' + idcours);
    }

    gofordetailpasse(idcours) {
        this.router.navigate(['/tabs/detailcoursepassee', idcours]);
    }

    public onPageChange(pageNum: number): void {
        this.pageSize = this.itemsPerPage * (pageNum - 1);
    }

    public onPageChange1(pageNum: number): void {

        this.pageSize1 = this.itemsPerPage1 * (pageNum - 1);
    }


    getonedispatcher() {
        this.clientservice.getonedispatcher().subscribe(res => {

            this.dispatcher = res[0];
            console.log('dispatcher',this.dispatcher)
        });
    }


    async getcourseByIdemployeefinal1(filter, periode) {
        this.data = [];

        this.isLoaded = false;

        const data = {
            'type': filter,
            'periode': periode,
            'employe': this.user.employe.split('/')[3]
        };

        await this.courseService.getCourseByperiode(data).then(res => {
            /*if (this.data && this.data.length > 0) {
                this.data.sort((b, a) => new Date(b.course.start).getTime() - new Date(a.course.start).getTime());
            }*/
            this.data = res;
            this.data.forEach(e => {
                e.course.checked = false;
            });
            this.isLoaded = true;
            console.log('course',this.data)
            setTimeout(() => {
                this.paginationViewer = true
            }, 1000);

        });

    }

    async getcourseterminer1(filter, date) {
        this.data = [];
        this.isLoaded = false;
        const data = {
            'type': filter,
            'periode': 'passé',
            'employe': this.user.employe.split('/')[3], 'date': date
        };
        // const loading = await this.loadingCtrl.create({
        //     message: ''
        // });
        // loading.present();

        await this.courseService.getcourseterminer(data).then(res => {
            this.data = res;
           /* if (this.data.length > 0) {
                this.data.sort(this.sortFunction);
            }*/
            console.log('course****',this.data)
            setTimeout(() => {
                this.paginationViewer = true
            }, 1000);
        });
        this.isLoaded = true;

    }

    sortFunction(a, b) {
        const dateA = new Date(a.start).getTime();
        const dateB = new Date(b.start).getTime();
        return dateA < dateB ? 1 : -1;

    }


    ngOnDestroy() {
        this.data = [];
        this.dataterminer = [];
        this.routerSubscription.unsubscribe();
    }

    doRefresh(event) {

        this.data = [];
        this.dataterminer = [];


        if (this.segmenValue === 'passé') {
            this.getcourseterminer1(this.filter, this.myDateNTime);
        } else if (this.segmenValue === 'Aujourdhui') {
            this.getcourseByIdemployeefinal1(this.filter, this.segmenValue);
        } else if (this.segmenValue === 'avenir') {
            this.getcourseByIdemployeefinal1(this.filter, this.segmenValue);
        }

        setTimeout(() => {
            if(event && event !='null')
            event.target.complete();
        }, 500);
    }


    async openPopover(ev: Event, idaffect, status1) {
        const popover = await this.popoverController.create({
            component: UpdatefromhomeComponent,
            componentProps: {
                custom_id: status1 + '/' + idaffect,
            },
            event: ev
        });
        popover.onDidDismiss()
            .then((result) => {
                this.getcourseByIdemployeefinal1(this.filter, this.segmenValue);
            });
        popover.present();

    }

    async openPopoverconfirmation(ev: Event, idaffect, status2) {
        const popover = await this.popoverController.create({
            component: UpdatestatusfromhomeComponent,
            componentProps: {
                custom_id: status2 + '/' + idaffect,
            },
            event: ev
        });
        popover.onDidDismiss()
            .then((result) => {

                this.getcourseByIdemployeefinal1(this.filter, this.segmenValue);

            });


        popover.present();

    }


    ajouteraupanier(idcourse, idaffect, affecta) {
        this.annulercourseaffect('course ajouter au panier', idaffect, idcourse, affecta, '1');
        //event refresh panier
        this.events.publish('user:refreshPanier', {
            user: true,
            //time: new Date()
        });
    }


    async annulercourseaffecter(idaffect, idcourse, affecta) {

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
                            this.annulercourseaffect(formData.motifannulation, idaffect, idcourse, affecta, '0');
                        }
                    }
                }
            ]
        });
        return await alert.present();
    }

    annulercourseaffect(motifannulation, idaffect, idcourse, affecta, panier) {

        const data = {
            'status1': '3',
            'status2': '6',
            'annulerpar': this.user.id.toString(),
            'annulerle': moment(new Date()).format('YYYY-MM-DDTH:mm'),
            'acceptepar': '',
            motifannulation
        };

        this.courseService.updatestatus1affect(idaffect, data).subscribe(res => {
            this.annulercours(idcourse, affecta, panier);
            this.getcourseByIdemployeefinal1(this.filter, this.segmenValue);
        });


    }

    annulercours(idcourse, affecta, panier) {
        const nomprenomuser = this.nom + ' ' + this.prenom;
        const newaffect = affecta.replace(nomprenomuser, '');
        const data = {'status': '0', 'backgroundcolor': '#000000', 'affecta': newaffect, panier: panier};
        this.courseService.updatecourse(idcourse, data).subscribe(res => {
            if(panier == '1')
            this.presentToastpanier();
            else
            this.presentAnnulationCourse();
        });

    }

    async presentAnnulationCourse() {
        const toast = await this.toastController.create({
            message: 'Course annulée',
            duration: 1000
        });
        toast.present();
    }

    async presentToastpanier() {
        const toast = await this.toastController.create({
            message: 'Course Ajoutée au panier !!',
            duration: 1000
        });
        toast.present();
    }

    async accepteraffectation(idaffect, status1,idcourse) {

        const data = {
          'status1': status1.toString(),
          'status2': '0',
          'acceptepar': this.user.id.toString(),
          'annulerpar': ''
        };
    
        this.courseService.updatestatus1affect(idaffect, data).subscribe(async res => {
          await this.geolocation.getCurrentPosition().then(async (resp) => {
    
            const datauser = {'latitude': resp.coords.latitude.toString(), 'longitude': resp.coords.longitude.toString()};
            await this.userservices.updateuserr(this.user.id, datauser).then(res1 => {
                console.log('updateuserr','ok')
            });
    
          });
          await this.acceptercourse(idcourse);
          await this.getaffectById(idaffect);


        });
      }

      async acceptercourse(idcourse) {

        const data = {'status': '2', 'backgroundcolor': '#0AAF20'};
    
        this.courseService.updatecourse(idcourse, data).subscribe(res => {
            console.log('updatecourse','ok')
            this.doRefresh(null)
        });
      }

      async getaffectById(idaffect) {
        this.courseService.getaffectById(idaffect).subscribe(async res => {
            console.log('getaffectById',res)
            await this.courseService.getcoursebyId(res['course'].replace('/api/courses/', '')).then((res1: any) => {
                console.log('getcoursebyId',res1)
            });

        });
      }

      getColorStatus1(status:String)
      {
        let color = '';
        switch (status) {
            case '0':
                color = '#FFFFFF'
                break;
            case '1':
                color = 'terminer'
                break;
            default:
                break;
        }
        return color
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

      getLabelStatus2(status2:String){
        let label = '';
        switch (status2) {
            case '0':
                label = 'En attente'
                break;
            case '1':
                label = 'En route'
                break;
            case '2':
                label = 'Surplace'
                break;
            case '3':
                label = 'Absent'
                break;
            case '4':
                label = 'Terminé'
                break;
            case '5':
                label = 'Abord'
                break;
            case '6':
                label = 'Absent'
                break;
            case '8':
                label = 'Absent + Déplacement'
                break;
            default:
                break;
        }
        return label
    }

      async confirmRefusCourse(idaffect, idcourse, affecta) {
        const alert = await this.alertCtrl.create({
          header: 'Refuser cette course',
          message: "Êtes-vous sûr de vouloir refuser cette course ?",
          mode: 'ios',
          inputs: [
            {
              name: 'motif',
              type: 'text',
              placeholder: 'Motif de refus',
              attributes: {
                require: true
              }
            },
          ],
          buttons: [
            {
              text: "Non",
              role: 'cancel',
              cssClass: 'secondary',
              handler: v => {
              }
            }, {
              text: "Oui",
              handler: async (data: any) => {
                if(data.motif != '')
                {
                    console.log('Motif', data);
                    this.annulercourseaffect(data.motif, idaffect, idcourse, affecta, '0');
                }
                else{
                    this.MessageMtifRequired();
                    return false;
                }
              }
            }
          ]
        });
        return await alert.present();
      }


      async confirmPanier(idcourse, idaffect, affecta) {
        const alert = await this.alertCtrl.create({
          header: 'Ajouter au panier',
          message: "Êtes-vous sûr de vouloir ajouter cette course au panier ?",
          mode: 'ios',
          buttons: [
            {
              text: "Non",
              role: 'cancel',
              cssClass: 'secondary',
              handler: v => {
              }
            }, {
              text: "Oui",
              handler: async (data: any) => {
                this.ajouteraupanier(idcourse, idaffect, affecta);
              }
            }
          ]
        });
        return await alert.present();
      }

      async MessageMtifRequired() {
        const alert = await this.alertCtrl.create({
          header: 'Motif de refus Obligatoire',
          message: "Veuillez saisir le motif de l'annulation de la course",
          mode: 'ios',
          buttons: [{
              text: "OK",
              handler: async (data: any) => {

              }
            }
          ]
        });
        return await alert.present();
      }

      async confirmAcceptCourse(idaffect, status1,idcourse) {
        this.isLoaded = false;
        this.accepteraffectation(idaffect, status1,idcourse);
        /*const alert = await this.alertCtrl.create({
          header: 'Accepter cette course',
          message: "Êtes-vous sûr de vouloir accepter cette course",
          mode: 'ios',
    
          buttons: [
            {
              text: "Non",
              role: 'cancel',
              cssClass: 'secondary',
              handler: status => {
              }
            }, {
              text: "Oui",
              handler: async () => {
                 this.accepteraffectation(idaffect, status1,idcourse);
                 this.doRefresh(null);
              }
            }
          ]
    
    
        });
        return await alert.present();*/
      }

      async confirmChangementCourse(idaffect, status2,course,newStatusC,newColorC) {
        const alert = await this.alertCtrl.create({
          header: 'Changement status de course',
          message: "\t"+this.getLabelStatus2(status2),
          mode: 'ios',
    
          buttons: [
            {
              text: "Non",
              role: 'cancel',
              cssClass: 'secondary',
              handler: status => {
              }
            }, {
              text: "Oui",
              handler: async () => {
                 console.log('ok')
                this.isLoaded = false
                 /************** */

                 let heurcourse;
                 const currentDateObj = new Date();
                 const numberOfMlSeconds = currentDateObj.getTime();
                 const addMlSeconds = 15 * 60 * 1000;
                 const newDateObj1 = new Date(numberOfMlSeconds - addMlSeconds).getHours() + ':' + (new Date(numberOfMlSeconds - addMlSeconds).getMinutes() < 10 ? '0' : '') + new Date(numberOfMlSeconds - addMlSeconds).getMinutes();
         
                 if (status2 === '1') {
                     heurcourse = {
                         heureenroute: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()
                     };
         
                 }
                 if (status2 === '2') {
                    heurcourse = {
                        heureenroute: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()
                    };
                }
                if (status2 === '3') {
                    heurcourse = {
                        heureabsentdeplacement: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()
                    };
                }
                if (status2 === '4') {
                    heurcourse = {
                        heuretermine: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()
                    };
                }
                if (status2 === '5') {
                     heurcourse = {
                         heureabord: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()
         
                     };
         
                 }

                 const statuscourse = course.status;
                 const backroundcolorcourse = course.backgroundcolor;

                 const data = {'status2': status2};

                 this.courseService.updatestatus2affect(idaffect, data).subscribe(async res => {

                    for (let i = 0; i < course.courseClients.length; i++) {
        
                        console.log('index', i + 'id' + course.courseClients[i].id);
                        console.log('***********',heurcourse)
                        this.courseService.updateheurcourseclient(course.courseClients[i].id, heurcourse).subscribe(res8 => {
                            console.log('***********',res8);
                        });

                    }
                    await this.getaffectById(idaffect);
                    this.updatestatuscourse(course.id, newStatusC, newColorC);

                    await this.geolocation.getCurrentPosition().then((resp) => {
                        const datauser = {'latitude': resp.coords.latitude.toString(), 'longitude': resp.coords.longitude.toString()};
                        this.userservices.updateuserr(this.user.id, datauser).then(res1 => {
        
                        });
        
                    });

                    this.doRefresh(null);

                });
                 /************** */

              }
            }
          ]
    
    
        });
        return await alert.present();
      }

      async updatestatuscourse(idcourse ,status, color) {
        const data = {'status': status.toString(), 'backgroundcolor': color};
        this.courseService.updatecourse(idcourse, data).subscribe(res => {
            console.log('***********',res);

        });
    }

    async SwipeChecked(id,e,index)
    {
        e.preventDefault();
        console.log('id',id)
        /*let item = this.data.find((x)=>{
            return x.course.id == id
        });
        //console.log('item',item)
        item.course.checked = !item.course.checked*/
        this.data[index].course.checked = !this.data[index].course.checked;

        console.log('data',this.data)

    }
      
}
