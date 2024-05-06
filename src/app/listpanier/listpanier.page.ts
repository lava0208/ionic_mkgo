import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {CourseService} from '../services/course.service';
import {ClientService} from '../services/client.service';
import {ModalaffectationpanierPage} from '../modalaffectationpanier/modalaffectationpanier.page';
import {ModalController, ToastController} from '@ionic/angular';
import * as moment from 'moment';
import {AffectationService} from '../services/affectation.service';
import {Router} from '@angular/router';
import { StorageService } from '../services/storage/storage.service';
import { EventsService } from '../services/events.service';
import 'moment-timezone';

@Component({
    selector: 'app-listpanier',
    templateUrl: './listpanier.page.html',
    styleUrls: ['./listpanier.page.scss'],
})
export class ListpanierPage implements OnInit {
    user:any;
    isLoaded = false;


    employeeid;
    userid;
    data;
    typeChauffeur;
    userconnectee;
    prenom;
    nom;

    isEnter:Boolean = false;

    constructor(
        private toastController: ToastController,
        private router: Router,
        private affectationservices: AffectationService,
        private location: Location,
        private courseService: CourseService,
        private clientService: ClientService,
        private modalController: ModalController,
        private storageService: StorageService,
        public events: EventsService,

    ) {
        this.events.subscribe('user:refreshPanier', (user) => {
            console.log('refreshPanier', user);
            this.isEnter = true
          });
    }

    async ngOnInit() {
        var locale = 'fr-ca';
        moment.locale(locale);
        
        this.isLoaded = false;

        //init storage
        await this.storageService.init();
        //init storage
        this.user = JSON.parse(await this.storageService.get('currentClientUser'));
        //console.log('currentClientUser', this.user)
        if(this.user && this.user.id)
        {
            await this.clientService.getemployeebyId(this.user.employe.split('/')[3]).then(res => {
                this.typeChauffeur = res['typechauffeur'];
                this.nom = res['nom'];
                this.prenom = res['prenom'];
    
            });
            this.userconnectee = this.user.id;

            await this.getcourseByIdemployeefinal1();
        }
        else
        {
            this.isLoaded = false;
        }
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

    cancel() {
        this.location.back();
    }

    ionViewWillEnter(){
        console.log('isEnter',this.isEnter)
        if(this.isEnter)
        {
            this.doRefreshe(null);
        }
    }

    async getcourseByIdemployeefinal1() {
        this.isLoaded = false;

        this.courseService.getcoursepanier().subscribe(res => {
            this.data = res;

            if (this.data.length > 0) {
                this.data.sort((b, a) => new Date(b['start']).getTime() - new Date(a['start']).getTime());
            }
            console.log('Course Panier',this.data);
            this.isLoaded = true;
        });

    }

    async presentModalpanier(idcourse, idaffect) {
        // console.log(idcourse, idaffect);
        const modal = await this.modalController.create({
            component: ModalaffectationpanierPage,
            cssClass: 'my-custom-class',
            componentProps: {
                idcourse: idcourse,
                idaffect: idaffect
            },
            mode: 'md',
            showBackdrop: false
        });


        modal.onDidDismiss()
            .then((result) => {

                this.getcourseByIdemployeefinal1();
            });
        modal.present();
    }

    goToChat(idcours) {

        this.router.navigateByUrl('/tabs/detailcourse/' + idcours);
    }

    async doRefreshe(event) {

        this.data = [];

        await this.getcourseByIdemployeefinal1();


        setTimeout(() => {
            if(event && event !='null')
            event.target.complete();
        }, 10);
    }

    affectcourse(idcourse) {

        const datacourse = {
            backgroundcolor: '#0AAF20',
            status: '2',
            borderColor: '#0AAF20',
            textColor: '#FFFFFF',
            affecta: this.nom + ' ' + this.prenom,
            panier: '0'
        };
        const dataaffect = {
            view: null,
            userconncete: this.user.id,
            affecta: this.nom + ' ' + this.prenom,
            affectedAt: moment(new Date()).format('YYYY-MM-DDTH:mm'),
            date: moment(new Date()).format('YYYY-MM-DDTH:mm'),
            status1: '0',
            status2: '0',
            course: idcourse,
            employe: [this.user.employe.split('/')[3]]
        };
        const dataupdateaffect = {
            status1: '1',
            status2: '0',
            acceptepar: this.user.id.toString(),
            annulerpar: ''
        };
        console.log('datacourse  :', datacourse);
        console.log('dataaffectation  :', dataaffect);
        console.log('dataupdateaffect  :', dataupdateaffect);
        this.affectationservices.addaffect(dataaffect).subscribe(res4 => {
            console.log(res4['id']);
            this.courseService.updateaffectation(res4['id'], dataupdateaffect).subscribe(res => {
                this.courseService.updatecourse(idcourse, datacourse).subscribe(res3 => {
                    this.getcourseByIdemployeefinal1();
                    this.presentToastpanier();
                });
            });


        });

    }

    async presentToastpanier() {
        //event refresh home
        this.events.publish('user:refresh', {
            user: true,
            //time: new Date()
        });

        const toast = await this.toastController.create({
            message: 'Course Acceptée !!',
            duration: 1000
        });
        toast.present();
    }
}
