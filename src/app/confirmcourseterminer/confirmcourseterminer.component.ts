import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActionSheetController, NavController, NavParams, PopoverController, ToastController} from '@ionic/angular';
import {NavigationExtras, Router} from '@angular/router';


import {FormBuilder, FormGroup} from '@angular/forms';
import {CourseService} from '../services/course.service';
import {UserService} from '../services/user.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ClientService} from '../services/client.service';
import {Course} from '../course';
import {CoursClient} from '../cours-client';
import { StorageService } from '../services/storage/storage.service';

@Component({
    selector: 'app-confirmcourseterminer',
    templateUrl: './confirmcourseterminer.component.html',
    styleUrls: ['./confirmcourseterminer.component.scss'],
})
export class ConfirmcourseterminerComponent implements OnInit {

    user:any;

    userloged;
    passedId = null;
    fileTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf'
    ];
    status2;
    idaffect;
    coursebyaffect;
    course = new Course();
    courseClients: CoursClient[] = [];
    courseClients1 = new CoursClient();
    formtermincourse: FormGroup;

    submit = false;
    imageFileName1 = '';
    imageFileName2 = '';
    filesToUpload1;
    filesToUpload2;
    soursefile1 = '';
    soursefile2 = '';
    validation_messages = {
        'kilometrage': [
            {type: 'required', message: 'kilometrage Obligatoire.'}
        ],
        'filename1': [
            {type: 'required', message: 'Fichier 1  Obligatoire.'}
        ], 'tarif': [
            {type: 'required', message: 'tarif Obligatoire .'}
        ], 'filename2': [
            {type: 'required', message: 'Fichier 2  Obligatoire.'}
        ],

    };
    prevoirretour = false;
    typeChauffeur;
    licenceChauffeur;

    constructor(
        private navParams: NavParams,
        private toastController: ToastController,
        public navCtrl: NavController,
        private geolocation: Geolocation,
        private userservices: UserService,
        private clientService: ClientService,
        private popoverController: PopoverController,
        private router: Router,
        public actionSheetCtrl: ActionSheetController,
        private formBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
        public camera: Camera,
        private courseService: CourseService,
        private storageService: StorageService,

                ) {



    }

    async ngOnInit() {

        this.getaffectById(this.navParams.get('custom_id').substr(2));
        this.formtermincourse = this.formBuilder.group({
            status2: [''],
            kilometrage: [''],
            tarif: [''],
            filename1: [null],
            filename2: [null]
        });
        this.idaffect = this.navParams.get('custom_id').substr(2);
        this.status2 = this.navParams.get('custom_id').substr(0, 1);
        //init storage
        await this.storageService.init();
        //init storage
        this.user = JSON.parse(await this.storageService.get('currentClientUser'));
        console.log('currentClientUser', this.user)
        if(this.user && this.user.id)
        {

        }
        else
        {

        }

        await this.clientService.getemployeebyId(this.user.employe.split('/')[3]).then(res => {
            this.userloged = res;
            this.typeChauffeur = res['typechauffeur'];
            this.licenceChauffeur = res['licence'].replace('/api/licences/', '');
        });


    }

    closePopover() {
        this.popoverController.dismiss();

    }

    get2Digit(value) {
        console.log(value);
        console.log(value.length);
        if (value.length === 1) {
            return '0' + '' + value;
        } else {
            return value;
        }
    }

    async updatestatus2affectation() {
        const str = this.formtermincourse.value.status2.toString();
        let heurcourse;
        const currentDateObj = new Date();
        const numberOfMlSeconds = currentDateObj.getTime();
        const addMlSeconds = 15 * 60 * 1000;
        const newDateObj1 = new Date(numberOfMlSeconds - addMlSeconds).getHours() + ':' + (new Date(numberOfMlSeconds - addMlSeconds).getMinutes() < 10 ? '0' : '') + new Date(numberOfMlSeconds - addMlSeconds).getMinutes();


        if (str === '1,#BBACAC,3') {
            heurcourse = {
                heureenroute: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()
            };

        }
        if (str === '5,#0F056B,5') {
            heurcourse = {
                heureabord: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()

            };

        }
        if (str === '8,#fd6c9e,8') {
            heurcourse = {
                heureabsentdeplacement: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()
            };

        }
        const statuscourse = str.substring(10, 11);
        const backroundcolorcourse = str.substring(2, 9);
        const data = {'status2': str.substring(0, 1)};

        this.courseService.updatestatus2affect(this.idaffect, data).subscribe(res => {

            console.log(this.course.courseClients);
            for (let i = 0; i < this.course.courseClients.length; i++) {

                console.log('index', i + 'id' + this.course.courseClients[i].id);
                this.courseService.updateheurcourseclient(this.course.courseClients[i].id, heurcourse).subscribe(res8 => {
                    console.log(res8);
                });
            }
            this.getaffectById(this.idaffect);
            this.updatestatuscourse(statuscourse, backroundcolorcourse);
            this.geolocation.getCurrentPosition().then((resp) => {
                const datauser = {'latitude': resp.coords.latitude.toString(), 'longitude': resp.coords.longitude.toString()};
                this.userservices.updateuserr(this.user.id.toString(), datauser).then(res1 => {

                });

            });
        });
        this.popoverController.dismiss('aaaa');

    }


    async getaffectById(id) {

        await this.courseService.getaffectbyId(id).then(async res => {

            await this.courseService.getcoursebyId(res['course'].replace('/api/courses/', '')).then((res1: any) => {
                this.coursebyaffect = res1;


                if (res1.entreprise) {

                    this.course.commentaire = res1.commentaire || '';
                    this.course.medical = res1.medical;
                    this.course.start = res1.start.split('T')[0];
                    this.course.tarif = res1.tarif || '';
                    this.course.paiement = res1.paiement;
                    this.course.entreprise = res1.entreprise.id;

                    // this.course.userid = res1.creerpar.toString().replace('/api/users/', '');
                    this.course.userid = this.user.id;

                    this.course.kilometrage = res1.kilometrage || '';
                } else if (!res1.entreprise) {

                    this.course.commentaire = res1.commentaire || '';
                    this.course.medical = res1.medical;
                    this.course.start = res1.start.split('T')[0];
                    this.course.tarif = res1.tarif || '';
                    this.course.paiement = res1.paiement;
                    // this.course.userid = res1.creerpar.toString().replace('/api/users/', '');
                    this.course.userid = this.user.id;

                    this.course.kilometrage = res1.kilometrage || '';

                }

                for (let i = 0; i < res1.courseClients.length; i++) {

                    this.addCourseClientEdit(i, res1.courseClients[i].id, res1.courseClients[i].client['id'],
                        res1.courseClients[i].destination,
                        res1.courseClients[i].depart, res1.courseClients[i].tel,
                        res1.courseClients[i].securitesocial, res1.courseClients[i].typemutuelle, res1.courseClients[i].distance,
                        res1.courseClients[i].duree, res1.courseClients[i].value);

                }


            });

        });

    }

    addCourseClientEdit(index, id, client?, destination?, depart?, tel?, securitesocial?, typemutuelle?, distance?, duree?, value?) {

        this.courseClients1.id = id;
        this.courseClients1.client = client;
        this.courseClients1.destination = depart;
        this.courseClients1.depart = destination;
        this.courseClients1.tel = tel.toString();
        this.courseClients1.distance = distance;
        this.courseClients1.duree = duree;
        this.courseClients1.value = value;
        this.courseClients1.securitesocial = securitesocial.toString();
        this.courseClients1.typemutuelle = typemutuelle.toString();

        this.course.courseClients.push(this.courseClients1);


    }

    acceptercourse() {
        const data = {'status': '2', 'backgroundcolor': '#0AAF20'};

        this.courseService.updatecourse(this.coursebyaffect.id, data).subscribe(res => {

        });
        this.geolocation.getCurrentPosition().then((resp) => {

            const datauser = {'latitude': resp.coords.latitude.toString(), 'longitude': resp.coords.longitude.toString()};
            this.userservices.updateuserr(this.user.id.toString(), datauser).then(res1 => {

            });

        });

    }

    updatestatuscourse(status, color) {
        const data = {'status': status, 'backgroundcolor': color};
        this.courseService.updatecourse(this.coursebyaffect.id, data).subscribe(res => {
        });
    }

    termineraffectation() {
        this.submit = true;
        if (this.coursebyaffect.medical === '1' || this.coursebyaffect.medical === '4') {
            this.formtermincourse.patchValue({
                kilometrage: ' '

            });
        }

        if (this.coursebyaffect.paiement === 'En compte') {
            this.formtermincourse.patchValue({
                tarif: this.coursebyaffect.tarif

            });

        }
        if (this.formtermincourse.invalid) {
            return;
        } else {
            const dataaffect = {'status2': '4'};

            const str = this.formtermincourse.value.status2.toString();

            const statuscourse = str.substring(10, 11);
            const backroundcolorcourse = str.substring(2, 9);
            const currentDateObj = new Date();
            const numberOfMlSeconds = currentDateObj.getTime();
            const addMlSeconds = 15 * 60 * 1000;
            const newDateObj = new Date(numberOfMlSeconds + addMlSeconds).getHours() + ':' + (new Date(numberOfMlSeconds + addMlSeconds).getMinutes() < 10 ? '0' : '') + new Date(numberOfMlSeconds + addMlSeconds).getMinutes();

            const heurcoursclient = {heuretermine: newDateObj};
            console.log(heurcoursclient);
            console.log(this.course.courseClients);
            for (let i = 0; i < this.course.courseClients.length; i++) {

                console.log('index', i + 'id' + this.course.courseClients[i].id);
                this.courseService.updateheurcourseclient(this.course.courseClients[i].id, heurcoursclient).subscribe(res8 => {
                    console.log(res8);
                });
            }

            this.courseService.updatestatus2affect(this.idaffect, dataaffect).subscribe(res => {

                this.terminerercourse(statuscourse, backroundcolorcourse);
                this.getaffectById(this.idaffect);
            });
            this.popoverController.dismiss();
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    image: this.userloged.filename,
                    nom: this.userloged.nom,
                    prenom: this.userloged.prenom

                }
            };

            this.navCtrl.navigateForward(['/tabs/home'], navigationExtras);
        }
        this.submit = false;
    }

    addValue(e): void {

        if (e.checked) {
            this.prevoirretour = true;
        }


    }

    termineraffectationencompt() {
        this.submit = true;

        if (this.formtermincourse.get('tarif').value === '' && this.coursebyaffect.tarif === '') {
            this.formtermincourse.patchValue({
                tarif: ' '

            });
        } else if (this.formtermincourse.get('tarif').value === '' && this.coursebyaffect.tarif !== null) {
            this.formtermincourse.patchValue({
                tarif: this.coursebyaffect.tarif

            });
        }


        if (this.coursebyaffect.medical === '1' || this.coursebyaffect.medical === '4') {
            this.formtermincourse.patchValue({
                kilometrage: ' '

            });
        }


        if (this.formtermincourse.invalid) {
            return;
        } else {
            const dataaffect = {'status2': '4'};

            const str = this.formtermincourse.value.status2.toString();

            const statuscourse = str.substring(10, 11);
            const backroundcolorcourse = str.substring(2, 9);
            const currentDateObj = new Date();
            const numberOfMlSeconds = currentDateObj.getTime();
            const addMlSeconds = 15 * 60 * 1000;
            const newDateObj = new Date(numberOfMlSeconds + addMlSeconds).getHours() + ':' + (new Date(numberOfMlSeconds + addMlSeconds).getMinutes() < 10 ? '0' : '') + new Date(numberOfMlSeconds + addMlSeconds).getMinutes();

            this.courseService.updatestatus2affect(this.idaffect, dataaffect).subscribe(res => {
                const heurcoursclient = {heuretermine: newDateObj};
                console.log(heurcoursclient);
                console.log(this.course.courseClients);
                for (let i = 0; i < this.course.courseClients.length; i++) {

                    console.log('index', i + 'id' + this.course.courseClients[i].id);
                    this.courseService.updateheurcourseclient(this.course.courseClients[i].id, heurcoursclient).subscribe(res8 => {
                        console.log(res8);
                    });
                }
                this.terminerercourse(statuscourse, backroundcolorcourse);
                this.getaffectById(this.idaffect);
            });
            this.popoverController.dismiss();
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    image: this.userloged.filename,
                    nom: this.userloged.nom,
                    prenom: this.userloged.prenom

                }
            };

            this.navCtrl.navigateForward(['/tabs/home'], navigationExtras);
        }
        this.submit = false;
    }

    public toFormData<T>(formValue: T) {
        const formData = new FormData();

        for (const key of Object.keys(formValue)) {
            const value = formValue[key];
            formData.append(key, value);
        }

        return formData;
    }

    async terminerercourse(statuscourse, backroundcolorcourse) {
        if (this.prevoirretour) {
            this.onSubmit();
        }
        const data = this.formtermincourse.value;

        const formData = this.toFormData(this.formtermincourse.value);

        formData.append('filename1', this.formtermincourse.value.filename1);
        formData.append('filename2', this.formtermincourse.value.filename2);
        if (this.filesToUpload1) {

            formData.append('filename1', this.filesToUpload1, this.imageFileName1);
        } else if (this.filesToUpload1 === undefined) {
            formData.append('filename1', new Blob([], {}));
        }
        if (this.filesToUpload2) {

            formData.append('filename2', this.filesToUpload2, this.imageFileName2);
        } else if (this.filesToUpload2 === undefined) {
            formData.append('filename2', new Blob([], {}));
        }
        formData.append('id', this.coursebyaffect.id);
        this.courseService.terminercourse(formData).subscribe(res => {

            this.updatestatuscourse(statuscourse, backroundcolorcourse);
            this.geolocation.getCurrentPosition().then((resp) => {

                const datauser = {'latitude': resp.coords.latitude.toString(), 'longitude': resp.coords.longitude.toString()};
                this.userservices.updateuserr(this.user.id.toString(), datauser).then(res1 => {

                });

            });
        });


    }


    async onFileChange1(file) {

        this.filesToUpload1 = file.target.files[0];

        if (this.fileTypes.includes(file.target.files[0].type) === true) {
            this.filesToUpload1 = file.target.files[0];


            this.imageFileName1 = new Date().getTime() + '.' + file.target.files[0].name.split('.').pop();

        } else {

            this.imageFileName1 = '';
            this.presentToastmedianovalid();
        }


    }

    async onFileChange2(file) {
        this.filesToUpload2 = file.target.files[0];

        if (this.fileTypes.includes(file.target.files[0].type) === true) {
            this.filesToUpload2 = file.target.files[0];


            this.imageFileName2 = new Date().getTime() + '.' + file.target.files[0].name.split('.').pop();

        } else {


            this.imageFileName2 = '';
            this.presentToastmedianovalid1();
        }


    }

    async presentToastmedianovalid() {
        const toast = await this.toastController.create({
            message: 'Le type de fichier est non supporté',
            duration: 2000
        });
        toast.present();
    }

    async presentToastmedianovalid1() {
        const toast = await this.toastController.create({
            message: 'Le type de fichier est non supporté',
            duration: 2000
        });
        toast.present();
    }


    async addPhoto1(source: string) {
        if (source === 'library') {

            this.soursefile1 = 'library';
            document.getElementById('file-input1').click();

        } else {

            this.soursefile1 = 'camera';
            const cameraImage = await this.openCamera();
            const base641 = await fetch('data:image/jpg;base64,' + cameraImage);
            this.filesToUpload1 = await base641.blob();
            this.imageFileName1 = new Date().getTime() + '.jpg';
        }

    }

    async addPhoto2(source: string) {
        if (source === 'library') {

            this.soursefile2 = 'library';
            document.getElementById('file-input2').click();

        } else {

            this.soursefile2 = 'camera';
            const cameraImage = await this.openCamera();
            const base641 = await fetch('data:image/jpg;base64,' + cameraImage);
            this.filesToUpload2 = await base641.blob();
            this.imageFileName2 = new Date().getTime() + '.jpg';
        }

    }

    async openCamera() {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 1000,
            targetHeight: 1000,
            sourceType: this.camera.PictureSourceType.CAMERA
        };
        return await this.camera.getPicture(options);
    }


    async selectImage1() {
        const actionSheet = await this.actionSheetCtrl.create({

            buttons: [
                {
                    text: 'Take a Photo',
                    handler: () => {

                        this.addPhoto1('camera');

                    }
                },
                {
                    text: 'Choose from Gallery',
                    handler: () => {

                        this.addPhoto1('library');

                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    async selectImage2() {
        const actionSheet = await this.actionSheetCtrl.create({

            buttons: [
                {
                    text: 'Take a Photo',
                    handler: () => {

                        this.addPhoto2('camera');

                    }
                },
                {
                    text: 'Choose from Gallery',
                    handler: () => {

                        this.addPhoto2('library');

                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }


    async onSubmit() {


        const formData = this.toFormData(this.course);

        if (this.filesToUpload1) {

            formData.append('filename1', this.filesToUpload1, this.imageFileName1);
        } else if (this.filesToUpload1 === undefined) {
            formData.append('filename1', new Blob([], {}));
        }
        if (this.filesToUpload2) {

            formData.append('filename2', this.filesToUpload2, this.imageFileName2);
        } else if (this.filesToUpload2 === undefined) {
            formData.append('filename2', new Blob([], {}));
        }


        formData.append('licence', this.licenceChauffeur);
        formData.append('affectcourse', 'Oui');
        formData.append('type', 'Retour');
        formData.append('employe', localStorage.getItem('user'));
        const arr = this.course.courseClients;
        for (let i = 0; i < arr.length; i++) {
            formData.append('courseClients[' + i + '][tel]', arr[i]['tel']);
            formData.append('courseClients[' + i + '][destination]', arr[i]['destination']);
            formData.append('courseClients[' + i + '][depart]', arr[i]['depart']);
            formData.append('courseClients[' + i + '][client]', arr[i]['client']);
            formData.append('courseClients[' + i + '][numSecusocial]', arr[i]['securitesocial']);
            formData.append('courseClients[' + i + '][mutuelle]', arr[i]['typemutuelle']);
            formData.append('courseClients[' + i + '][duree]', arr[i]['value']);
            formData.append('courseClients[' + i + '][distance]', arr[i]['distance']);
            formData.append('courseClients[' + i + '][dureetext]', arr[i]['duree']);
        }

        this.courseService.addcourse(formData).subscribe(res => {

        }, error => {
            this.presentToastErreur();
        });

        this.imageFileName1 = '';
        this.imageFileName2 = '';
        this.filesToUpload1 = undefined;
        this.filesToUpload2 = undefined;
        this.course = null;


    }


    async presentToastErreur() {
        const toast = await this.toastController.create({
            message: 'une erreur s\'est produite!',
            duration: 2000
        });
        toast.present();
    }
}
