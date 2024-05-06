import {Component, OnInit} from '@angular/core';
import {AlertController, NavController, PopoverController} from '@ionic/angular';

import {ActivatedRoute, Router} from '@angular/router';
import {CourseClientService} from '../services/course-client.service';
import {ClientService} from '../services/client.service';
import {CourseService} from '../services/course.service';
import { StorageService } from '../services/storage/storage.service';


@Component({
    selector: 'app-detailcoursepassee',
    templateUrl: './detailcoursepassee.page.html',
    styleUrls: ['./detailcoursepassee.page.scss'],
})
export class DetailcoursepasseePage implements OnInit {


    date: any;
    time: any;

    destLoc: any;
    rideData: any;

    userconnectee;
    clientIds;
    dispatcher;
    course;

    status1;
    status2;
    idaffect;
    client: Object;
    today = new Date().setHours(0, 0, 0, 0);
    datcourse;
    userloged;

    constructor(private popoverController: PopoverController,
                private courseClient: CourseClientService,
                private clientService: ClientService,
                private router: Router,
                public alertCtrl: AlertController,
                private courseService: CourseService,
                public actvroute: ActivatedRoute, public route: Router, private storageService: StorageService, private clientservice: ClientService,
                public navCtrl: NavController) {
        this.clientService.getemployeebyId(localStorage.getItem('user')).then(res => {
            console.log('detailcoures.ts', res);
            this.userloged = res;
        });
        this.clientService.getonedispatcher().subscribe(res => {
            console.log('disp', res);
            this.dispatcher = res[0];
        });

        this.userconnectee = localStorage.getItem('userid');


        this.actvroute.params.subscribe(params => {
            this.rideData = params.id;
        });
    }

    doRefresh(event) {

        this.getcourse(this.rideData);
        setTimeout(() => {

            event.target.complete();
        }, 500);
    }

    ionViewWillEnter() {
        this.getcourse(this.rideData);


    }


    getcourse(id) {
        this.courseService.detailcourse(id).then(res => {
            console.log('Course', res);
            this.course = res;
            this.idaffect = res['affectationcourses'][0]['id'];
            console.log(this.idaffect);
            this.datcourse = new Date(res['start']).setHours(0, 0, 0, 0);
            this.courseService.getaffectById(this.idaffect).subscribe(res1 => {
                console.log(res1);


            });
        });
    }


    ngOnInit(): void {
    }


}
