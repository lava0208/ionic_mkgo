import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavController, NavParams, PopoverController} from '@ionic/angular';
import {NavigationExtras, Router} from '@angular/router';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {UserService} from '../services/user.service';
import {CourseService} from '../services/course.service';
import {ClientService} from '../services/client.service';
import { StorageService } from '../services/storage/storage.service';

@Component({
  selector: 'app-updatefromhome',
  templateUrl: './updatefromhome.component.html',
  styleUrls: ['./updatefromhome.component.scss'],
})
export class UpdatefromhomeComponent implements OnInit {
  user:any;
  isLoaded = false;

  passedId = null;
  motifrefus;
  motifannulation;
  status1;
  idaffect;

  iduser;
  coursebyaffectid;
  formrefus: FormGroup;
  userconnectee;
  validation_messages = {
    'motifrefus': [
      {type: 'required', message: 'motif de refus   Obligatoire.'}
    ],
  };
  submit = false;
  newaffecta = '';

  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController,
    private router: Router,
    private formBuilder: FormBuilder,
    private geolocation: Geolocation,
    private userservices: UserService,
    private courseService: CourseService,
    private clientservice: ClientService,
    public navCtrl: NavController,
    private storageService: StorageService,
 ) {

  }

  async ngOnInit() {

      this.navParams.get('custom_id');
      this.idaffect = this.navParams.get('custom_id').substr(2);
      this.status1 = this.navParams.get('custom_id').substr(0, 1);

      this.getaffectById();
      this.formrefus = this.formBuilder.group({
        motifrefus: ['', Validators.required]
      });
      
      //init storage
      await this.storageService.init();
      //init storage
      this.user = JSON.parse(await this.storageService.get('currentClientUser'));
      console.log('currentClientUser', this.user)
      if(this.user && this.user.id)
      {
        this.clientservice.getemployeebyId(this.user.employe.split('/')[3]).then(res => {

          this.userconnectee = res;
        });

        this.isLoaded = true;


      }
      else
      {
          this.isLoaded = false;
      }




  }

  closePopover() {
    this.popoverController.dismiss();

  }

  accepteraffectation(status1) {

    const data = {
      'status1': status1.toString(),
      'status2': '0',
      'acceptepar': localStorage.getItem('userid').toString(),
      'annulerpar': ''
    };

    this.courseService.updatestatus1affect(this.idaffect, data).subscribe(res => {
      this.geolocation.getCurrentPosition().then((resp) => {

        const datauser = {'latitude': resp.coords.latitude.toString(), 'longitude': resp.coords.longitude.toString()};
        this.userservices.updateuserr(localStorage.getItem('userid'), datauser).then(res1 => {

        });

      });
      this.acceptercourse();
      this.getaffectById();
    });
  }

  refuserraffectation(status1) {
    this.submit = true;
    const data = {
      'status1': status1.toString(),
      'motifrefus': this.formrefus.value.motifrefus,
      'status2': '6',
      'refuserpar': localStorage.getItem('userid').toString()
    };

    if (this.formrefus.invalid) {
      return;
    } else {
      this.courseService.updatestatus1affect(this.idaffect, data).subscribe(res => {

        this.refuserercourse();
        this.geolocation.getCurrentPosition().then((resp) => {

          const datauser = {'latitude': resp.coords.latitude.toString(), 'longitude': resp.coords.longitude.toString()};
          this.userservices.updateuserr(localStorage.getItem('userid'), datauser).then(res1 => {

          });

        });
      });
      this.closePopover();
    }
    this.submit = false;
  }

  getaffectById() {
    this.courseService.getaffectById(this.idaffect).subscribe(res => {
      this.coursebyaffectid = res['course'].replace('/api/courses/', '');
      this.courseService.getCoursebyId(this.coursebyaffectid).subscribe(res1 => {

        this.newaffecta = res1['affecta'];

      });
    });
  }

  acceptercourse() {

    const data = {'status': '2', 'backgroundcolor': '#0AAF20'};

    this.courseService.updatecourse(this.coursebyaffectid, data).subscribe(res => {

    });
  }

  refuserercourse() {
    const nomprenomuser = this.userconnectee.nom + ' ' + this.userconnectee.prenom;

    const newaffect = this.newaffecta.replace(nomprenomuser, '');

    const data = {'status': '0', 'backgroundcolor': '#000000', 'affecta': newaffect};

    this.courseService.updatecourse(this.coursebyaffectid, data).subscribe(res => {

    });
    const navigationExtras: NavigationExtras = {
      queryParams: {
        image: this.userconnectee.filename,
        nom: this.userconnectee.nom,
        prenom: this.userconnectee.prenom

      }
    };

    this.navCtrl.navigateForward(['/tabs/home'], navigationExtras);
  }
}
