import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams, PopoverController, ToastController} from '@ionic/angular';
import {UserService} from '../services/user.service';
import {CourseService} from '../services/course.service';
import {FormBuilder, FormGroup} from '@angular/forms';

import * as $ from 'jquery';
import '../../assets/select2.min.js';
import '../../assets/jquery.js';
import '../../assets/select2.min.css';
import '../../assets/bootstrap.min.css';
import {AffectationService} from '../services/affectation.service';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'app-modalpage',
    templateUrl: './modalpage.page.html',
    styleUrls: ['./modalpage.page.scss'],
})
export class ModalpagePage implements OnInit {

    listchauffeurtaximedical = [];

    public filterValue;

    idcourse;
    chauffeurselectionner;
    course;
    nom;
    prenom;
    etat;
    idaffect;
    chauufeurselction;
    motifannulation = '';
    submitted = false;

    constructor(private navParams: NavParams, private affectationservices: AffectationService,
                public viewCtrl: ModalController, private userservices: UserService,
                private courseService: CourseService, private activatedRoute: ActivatedRoute,
                private toastController: ToastController
    ) {

        this.getchauffeurappartienta(this.navParams.get('idcourse'));
        this.activatedRoute.queryParams.subscribe(params => {

            this.nom = params['nom'];
            this.prenom = params['prenom'];



        });
    }

    ngOnInit() {
        this.idcourse = this.navParams.get('idcourse');
        this.idaffect = this.navParams.get('idaffect');
        $(document).ready(function () {
            const employes = [];
            const affecta = [];
            $('.clientselect').select2({
                allowClear: true,
                placeholder: 'Choisir chauffeur',

            });
        });
    }




    getchauffeurappartienta(idcourse) {

        this.listchauffeurtaximedical = [];
        this.courseService.getCoursebyId(idcourse).subscribe((res2: any) => {

            this.course = res2;
            this.userservices.getallchauffeurpartype({
                typechauffeur: 'Medical'
            }).subscribe((res1: any) => {

                this.userservices.getallchauffeurpartype({
                    typechauffeur: 'Taxi'
                }).subscribe((res: any) => {

                    this.listchauffeurtaximedical = res.concat(res1);


                });
            });
        });



    }

    ionViewWillEnter() {

    }

    async affect() {
        const employeeid = [];


        const employeename = $('.clientselect').select2('data');
        this.chauufeurselction = employeename;
        const emp1 = employeename.map(x => x.text);


        $('.clientselect  > option:selected').each(function () {
            employeeid.push($(this).val());

        });

        this.submitted = true;

        if (employeeid.length >= 1) {
            this.annulavecaffectation(this.idaffect, this.idcourse, emp1, employeeid);
            this.submitted = false;
            this.closePopoveradd(this.etat);

        } else if (employeeid.length === 0) {

            return;
        }

    }


    annulavecaffectation(idaffect, idcourse, emp1, employeeid) {
        const data = {
            'status1': '3',
            'status2': '6',
            'annulerpar': localStorage.getItem('userid').toString(),
            'annulerle': moment(new Date()).format('YYYY-MM-DDTH:mm'),
            'acceptepar': '',
            motifannulation: this.motifannulation
        };
        this.courseService.updatestatus1affect(idaffect, data).subscribe(res => {
            this.affectcourse(emp1, employeeid);
         });


    }

    affectcourse(emp1, employeeid) {

        this.etat = 'reaffectation';
        this.affectationservices.addaffect({
            view: null,
            userconncete: localStorage.getItem('userid'),
            affecta: emp1.toString(),
            affectedAt: moment(new Date()).format('YYYY-MM-DDTH:mm'),
            affectepar: this.nom + ' ' + this.prenom,
            date: moment(new Date()).format('YYYY-MM-DDTH:mm'),
            status1: '0',
            status2: '0',
            course: this.idcourse,
            employe: employeeid
        }).subscribe(res4 => {
            this.courseService.updatecourse(this.idcourse, {
                backgroundcolor: '#F17407',
                status: '1',
                borderColor: '#0ac7ed',
                textColor: '#FFFFFF',
                affecta: emp1.toString(),
            }).subscribe(res3 => {

            });


        });

    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'il faut au moins choisir un client!',
            position: 'bottom',
            duration: 2100
        });
        toast.present();
    }

    async closePopoveradd(item2?) {

        const data1 = item2;
        this.presentToast1();
        const modal = await this.viewCtrl.getTop();
        modal.dismiss(data1);

    }

    async closePopover() {
        this.etat = 'fermer';
        this.presentToast2();
        const modal = await this.viewCtrl.getTop();
        modal.dismiss('', this.etat);

    }

    async presentToast1() {
        const toast = await this.toastController.create({
            message: ' course affectater  avec succès !',
            position: 'bottom',
            duration: 2000
        });
        toast.present();
    }

    async presentToast2() {
        const toast = await this.toastController.create({
            message: '  affectatation  non terminer  !',
            position: 'bottom',
            duration: 2000
        });
        toast.present();
    }
}
