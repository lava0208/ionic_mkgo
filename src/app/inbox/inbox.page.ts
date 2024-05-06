import {Component, OnInit} from '@angular/core';
import {CourseService} from '../services/course.service';
import {ClientService} from '../services/client.service';
import {ModalController} from '@ionic/angular';
import { StorageService } from '../services/storage/storage.service';
import {Location} from '@angular/common';
import * as moment from 'moment';


@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.page.html',
    styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
    user:any;
    isLoaded = false;
    debutClickDate:Boolean = false;
    finClickDate:Boolean = false;

    debut:String = '';
    fin:String = '';

    userid;
    data;
    stastique;
    image;
    nom;
    prenom;
    dispatcher;
    userconnectee;
    chauffeurfilter = '';
    listchaff;
    statchauff;

    from;
    to;
    type;
    today = new Date();
minute;
seconde;
heur;

mindate = new Date().setDate(new Date().getDate());


    constructor(
        private courseService: CourseService,
        private clientserv: ClientService,
        public modalCtrl: ModalController,
        private storageService: StorageService,
        private location: Location,

          ) {


    }

    ionViewWillEnter(){
        this.debut = '';
        this.fin = '';
        this.doRefresh(null);
    }

    debutChangeDateClick()
    {
        this.debutClickDate = !this.debutClickDate
    }

    finChangeDateClick()
    {
        this.finClickDate = !this.finClickDate
    }

    async ngOnInit() {

        //init storage
        await this.storageService.init();
        //init storage
        this.user = JSON.parse(await this.storageService.get('currentClientUser'));
        console.log('currentClientUser', this.user)
        if(this.user && this.user.id)
        {
        // console.log('employeeid in rapport', localStorage.getItem('user'));
        this.clientserv.getemployeebyId(this.user.employe.split('/')[3]).then(res => {
                // console.log(res);
                this.userconnectee = res;
            });
            await this.getstatistique();
        }
        else
        {
            this.isLoaded = false;
        }


    }

    getonedispatcher() {
        this.clientserv.getonedispatcher().subscribe(res => {
            // console.log('disp', res);
            this.dispatcher = res[0];
        });
    }

    async getstatistique() {

        const data = {
            debut: this.debut, fin: this.fin, chauffeur: this.user.employe.split('/')[3]
        };

        console.log(data);

        this.courseService.statstiquechauffeur(data).subscribe((res: any) => {
            console.log('statstique', res);
            this.stastique = res[0];

            if(this.stastique)
            {
                let totalSeconds = res[0]['totalduree'];
                const hours = Math.floor(totalSeconds / 3600);
                 totalSeconds %= 3600;
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
    
                console.log('hours: ' + hours);
                console.log('minutes: ' + minutes);
                console.log('seconds: ' + seconds);
    
    // If you want strings with leading zeroes:
                this.minute = String(minutes).padStart(2, '0');
                this.heur = String(hours).padStart(2, '0');
                this.seconde = String(seconds).padStart(2, '0');
                console.log(hours + ':' + minutes + ':' + seconds);
            }
            // this.total = 0;
            this.isLoaded = true;

        });
    }

    cancel() {
        this.location.back();
    }

    onChange($event) {
        console.log($event);
    }

    doRefresh(event) {
        if(!this.user)
        return
        this.getstatistique();
        setTimeout(() => {
            if(event && event !='null')
            event.target.complete();
        }, 500);
    }

    DebutmomentDateFr(e)
    {
      //let date = new Date(e.target.value).toISOString().substring(0, 10);
      console.log('date',moment(e.target.value).format('YYYY-MM-DD'));
      const d = moment(e.target.value).format('YYYY-MM-DD');
      this.debut = d.toString();
      this.debutClickDate = false;
      this.doRefresh(null)
      return d.toString();
    }

    FinmomentDateFr(e)
    {
      //let date = new Date(e.target.value).toISOString().substring(0, 10);
      console.log('date',moment(e.target.value).format('YYYY-MM-DD'));
      const d = moment(e.target.value).format('YYYY-MM-DD');
      this.fin = d.toString();
      this.finClickDate = false;
      this.doRefresh(null)
      return d.toString();
    }
}
