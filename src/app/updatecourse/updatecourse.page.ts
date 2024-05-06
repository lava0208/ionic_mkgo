import {
    ActionSheetController,
    AlertController,
    LoadingController,
    ModalController,
    NavController,
    PopoverController,
    ToastController
} from '@ionic/angular';
import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';


import {Camera, CameraOptions} from '@ionic-native/camera/ngx';


import {AddclientmodalPage} from '../addclientmodal/addclientmodal.page';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import * as moment from 'moment';

import {EntrepriseService} from '../services/entreprise.service';
import {ClientService} from '../services/client.service';
import {CourseService} from '../services/course.service';

import {UserService} from '../services/user.service';

import {CourseClientService} from '../services/course-client.service';

import {DatePicker} from '@ionic-native/date-picker/ngx';

import {Geolocation} from '@ionic-native/geolocation/ngx';
import * as $ from 'jquery';
import '../../assets/select2.min.js';
import '../../assets/jquery.js';
import '../../assets/select2.min.css';
import '../../assets/bootstrap.min.css';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import {LaunchNavigator} from '@awesome-cordova-plugins/launch-navigator/ngx';
import {Location} from '@angular/common';
import { StorageService } from '../services/storage/storage.service';

declare var google;

@Component({
    selector: 'app-updatecourse',
    templateUrl: './updatecourse.page.html',
    styleUrls: ['./updatecourse.page.scss'],
})
export class UpdatecoursePage implements OnInit {
    directionsService = new google.maps.DirectionsService;
    autocompleteItems = [];
    item: any;
    myDate;
    types;
    modepayments: Array<any>;
    listlicence;
    listentreprise;
    listclients;

    closecard;
    closecard1;
    licence;
    medical;
    terms;
    start;
    client;
    depart = '';
    destination = '';
    tel;

    mutuelle;
    entreprise;
    clientres;
    courseForm: FormGroup;
    courseClients: FormArray;
    userconnectee;
    showselect = false;

    idclient;
    filesToUpload1;
    filesToUpload2;
    imageFileName1: any;
    imageFileName2: any;
    soursefile1 = '';
    soursefile2 = '';
    indexmodal;
    myDateNTime: string;
    userloged;
    dispatcher;
    fileTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf'
    ];

    date: any;
    time: any;

    lat: number;
    lng: number;

    rideData: any;


    clientIds;

    course;

    status2;
    idaffect;
    licenceChauffeur;

    datcourse;
    employeeid;


    errorMessage: string;
    submited = false;


    datetimeobligatoire = false;
    disp;
    libelle;
    idcourse;
    newclient = false;
    listadresse;
    clientmodal;
    selectedRadioGroup = false;

    position;
    heurecourse;

    typeChauffeur;
    public data: any = {
        type: ''
    };

    constructor(private popoverController: PopoverController, private androidPermissions: AndroidPermissions, private location: Location,
                private userservices: UserService,
                private geolocation: Geolocation,
                private locationAccuracy: LocationAccuracy, private launchNavigator: LaunchNavigator, public loadingCtrl: LoadingController,
                private courseClient: CourseClientService,
                private clientService: ClientService, private clipboard: Clipboard,
                private router: Router, private __zone: NgZone,
                private datePicker: DatePicker,
                private courseService: CourseService,
                public actvroute: ActivatedRoute,
                private storageService: StorageService,
                private toastController: ToastController,
                public alertCtrl: AlertController, public navCtrl: NavController, public actionSheetCtrl: ActionSheetController,
                public camera: Camera,
                public formBuilder: FormBuilder,
                private entrepriseService: EntrepriseService,
                public modalCtrl: ModalController) {


        this.userconnectee = localStorage.getItem('user');

        this.clientService.getonedispatcher().subscribe(res => {

            this.dispatcher = res[0];
        });
        this.getallentreprise();
        this.getonedispatcher();

        this.modepayments = [

            'CB',
            'ESP',
            'En compte',
        ];


        this.clientService.getemployeebyId(localStorage.getItem('user')).then(res => {

            this.userloged = res;

            this.typeChauffeur = res['typechauffeur'];
            this.licenceChauffeur = res['licence'].replace('/api/licences/', '');
        });

        this.actvroute.params.subscribe(params => {
            this.rideData = params.id;
            this.idcourse = params.id;

        });
        this.employeeid = localStorage.getItem('user');

    }

    gettypecourse(type) {

        this.courseService.typecc(type).subscribe(res => {

            this.libelle = res['libelle'];

        });
    }


    getonedispatcher() {
        this.clientService.getonedispatcher().subscribe((res: any) => {

            this.dispatcher = res[0];

        });

    }


    async presentAdresseoast() {
        const toast = await this.toastController.create({
            message: 'Adresse copier!',
            duration: 1000
        });
        toast.present();
    }


    getlistadresse(client) {
        this.listadresse = [];
        for (let j = 1; j <= 5; j++) {
            if (client['adresse' + j] || client['titre' + j]) {
                this.listadresse.push({
                    adresse: client['adresse' + j],
                    titre: client['titre' + j]
                });
            }
        }
        this.listadresse.push({
            adresse: 'autre',
            titre: null
        });

    }

    newcourseclient(id, client) {

        this.newclient = true;

        this.getlistadresse(client);
        let depart = '';
        let destination = '';
        if (client['titre1']) {
            depart = client['titre1'] + ':' + client['adresse1'];
            destination = client['titre1'] + ':' + client['adresse1'];
        } else if (!client['titre1'] || client['titre1'] === '') {
            depart = client['adresse1'];
            destination = client['adresse1'];
        }
        $('#destination' + id).css('display', '');
        $('#depart' + id).css('display', '');

        this.clients().at(id).patchValue({
            depart: depart,
            destination: destination,
            tel: client.tel,
            securitesocial: client.securitesociale,
            typemutuelle: client.mutuelle
        });
        document.getElementById('depart' + id).setAttribute('placeholder', depart);
        document.getElementById('destination' + id).setAttribute('placeholder', destination);
        document.getElementById('departmodif' + id).style.display = 'none';
        document.getElementById('destinationmodif' + id).style.display = 'none';
        document.getElementById('client' + id).setAttribute('value', client.id);

        $('#adresseinput_' + id).css('display', 'none');
        $('#arriveinput_' + id).css('display', 'none');

    }


    openSelect() {

        document.getElementById('appartient').style.display = 'none';


    }


    cancel() {
        this.location.back();
    }

    ngOnInit(): void {


        this.userconnectee = localStorage.getItem('useridadmin');


        this.getalltypeclient();
        this.courseForm = this.formBuilder.group({
            commentaire: ['', Validators.required],
            start: ['', Validators.required],
            medical: ['', Validators.required],
            tarif: ['', Validators.required],
            paiement: ['', Validators.required],
            entreprise: ['', Validators.required],
            kilometrage: ['', Validators.required],
            userid: localStorage.getItem('userid'),
            courseClients: this.formBuilder.array([])
        });

        this.getcourse(this.rideData);

    }


    public focusInput(event): void {

        let total = 0;
        let container = null;

        const _rec = (obj) => {

            total += obj.offsetTop;
            const par = obj.offsetParent;
            if (par && par.localName !== 'ion-content') {
                _rec(par);
            } else {
                container = par;
            }
        };
        _rec(event.target);
        container.scrollToPoint(0, total - 50, 400);
    }

    getalltypeclient() {
        this.clientService.getalltypeclient().subscribe(res => {
            this.types = res['hydra:member'];
        });
    }

    change(datePicker) {


        datePicker.open();
    }

    calculateAndDisplayRoute(origin, destination, index) {

        this.directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING'
        }, (response, status) => {

            if (status === 'OK') {
                this.clients().at(index).patchValue({
                    duree: response.routes[0].legs[0].duration['text'],
                    distance: response.routes[0].legs[0].distance['text'],
                    value: response.routes[0].legs[0].duration['value']
                });
            }
        });

    }

    addCourseClientEdit(id = '', client?, destination?, depart?, tel?, securitesocial?, typemutuelle?, distance?, duree?, value?) {
        const courseClient = this.courseForm.get('courseClients') as FormArray;
        courseClient.push(this.formBuilder.group({
            id: ['' || id],
            client: [client],
            destination: [destination],
            depart: [depart],
            tel: [tel],
            securitesocial: [securitesocial],
            typemutuelle: [typemutuelle],
            distance: [distance],
            duree: [duree],
            value: [value],
        }));


    }
    onChangeHandler($event) {
        this.data.type = $event.target.value;
    }
    addCourseClient() {
        const courseClient = this.courseForm.get('courseClients') as FormArray;
        courseClient.push(this.formBuilder.group({
            id: '',
            client: '',
            destination: '',
            depart: '',
            tel: '',
            securitesocial: '',
            typemutuelle: '',
            distance: '',
            duree: '',
            value: '',
        }));
    }

    getcourse(id: number) {

        this.courseService.detailcourse(id)
            .then(
                (course: any) => {

                    this.course = course;

                    this.myDateNTime = moment.utc(course.start).format('YYYY-MM-DDTHH:mm');

                    this.heurecourse = moment(this.myDateNTime).utcOffset(0, true).format('HH:mm');
                    this.imageFileName1 = course.filename1;
                    this.imageFileName2 = course.filename2;
                    this.data.type = course.type;
                    if (course.entreprise) {

                        this.courseForm.patchValue({
                            commentaire: course.commentaire,
                            medical: course.medical,
                            start: course.start,
                            tarif: course.tarif,
                            paiement: course.paiement,
                            entreprise: course.entreprise.id,
                            kilometrage: course.kilometrage


                        });
                    } else if (!course.entreprise) {

                        this.courseForm.patchValue({
                            commentaire: course.commentaire,
                            medical: course.medical,
                            start: course.start,
                            tarif: course.tarif,
                            paiement: course.paiement,
                            entreprise: '',
                            kilometrage: course.kilometrage


                        });

                    }
                    for (let i = 0; i < course.courseClients.length; i++) {

                        this.addCourseClientEdit(course.courseClients[i].id, course.courseClients[i].client,
                            course.courseClients[i].destination,
                            course.courseClients[i].depart, course.courseClients[i].tel,
                            course.courseClients[i].securitesocial, course.courseClients[i].typemutuelle, course.courseClients[i].distance, course.courseClients[i].duree, course.courseClients[i].value);

                    }
                    this.gettypecourse(course['medical']);

                    this.getallclient(course['medical']);

                }
            );

    }


    ionViewDidEnter() {

    }


    async loading(message) {
        const loader = await this.loadingCtrl.create({
            message
        });
        return loader;
    }

    getalllicences() {
        this.entrepriseService.getalllicences().subscribe(res => {

            this.listlicence = res['hydra:member'];

        });
    }


    getallentreprise() {
        this.entrepriseService.getallentreprise().subscribe(res => {

            this.listentreprise = res['hydra:member'];
        });
    }

    clients(): FormArray {
        return this.courseForm.get('courseClients') as FormArray;
    }

    getallclient(type) {

        this.selectedRadioGroup = true;

        this.clientService.getclientbytype(type).subscribe(res => {

            this.listclients = res;

        });
    }


    dismiss() {

        this.modalCtrl.dismiss();

    }


    async presentModal(ev, type, i) {
        if (type !== '') {
            this.indexmodal = i;

            this.showselect = true;

            const modal = await this.modalCtrl.create({
                component: AddclientmodalPage,
                componentProps: {typeclient: type},


            });
            modal.onDidDismiss()
                .then((result) => {

                    if (result.role === 'add') {
                        this.getclientatermodal(i, result.data);

                        document.getElementById('ajout' + i).style.display = 'none';
                    } else if (result.role === 'fermer') {

                        document.getElementById('ajout' + i).style.display = 'inline-block';

                    }


                });

            modal.present();
        } else {
            this.alerttypeclient();
        }
    }


    getclientatermodal(index, id) {
        this.clientService.getclientbyId(id).subscribe(res => {

            this.clientmodal = res[0];
            this.clients().at(index).patchValue({
                client: {nom: res[0].nom, id: res[0].id}
            });
            this.newcourseclient(index, res[0]);
        });

        this.showselect = false;

    }


    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Course modifier avec succès!',
            duration: 1000
        });
        toast.present();
    }

    async presentToastErreur() {
        const toast = await this.toastController.create({
            message: 'une erreur s\'est produite!',
            duration: 2000
        });
        toast.present();
    }

    async presentToastErreuclient() {
        const toast = await this.toastController.create({
            message: 'il faut au moins choisir un client!',
            duration: 2000,
            cssClass: 'alert'
        });
        toast.present();
    }


    public toFormData<T>(formValue: T) {
        const formData = new FormData();

        for (const key of Object.keys(formValue)) {
            const value = formValue[key];
            formData.append(key, value);
        }

        return formData;
    }


    async onSubmit(idcourse) {

        this.heurecourse = moment(this.courseForm.get('start').value).utcOffset(0, true).format('HH:mm');

        this.submited = true;

        this.datetimeobligatoire = false;

        const formData = this.toFormData(this.courseForm.value);


        if (this.filesToUpload1) {
            // const base64 = await fetch(this.filesToUpload1);
            formData.append('filename1', this.filesToUpload1, this.imageFileName1);
        } else if (this.filesToUpload1 === undefined) {
            formData.append('filename1', new Blob([], {}));
        }
        if (this.filesToUpload2) {
            // const base641 = await fetch(this.filesToUpload2);
            formData.append('filename2', this.filesToUpload2, this.imageFileName2);
        } else if (this.filesToUpload2 === undefined) {
            formData.append('filename2', new Blob([], {}));
        }
        if (this.clients().length > 0 && this.clients().at(0).value.client) {
            formData.append('affectcourse', 'Non');
            formData.append('idcourse', idcourse);
            formData.append('employe', null);
            formData.append('heurecourse', this.heurecourse);
            formData.append('licence', this.licenceChauffeur);
            formData.append('type', this.data.type);


            const arr = this.courseForm.get('courseClients').value;
            for (let i = 0; i < arr.length; i++) {
                formData.append('courseClients[' + i + '][id]', arr[i]['id']);
                formData.append('courseClients[' + i + '][tel]', arr[i]['tel']);
                formData.append('courseClients[' + i + '][destination]', arr[i]['destination']);
                formData.append('courseClients[' + i + '][depart]', arr[i]['depart']);
                formData.append('courseClients[' + i + '][client]', arr[i]['client']['id']);
                formData.append('courseClients[' + i + '][securitesocial]', arr[i]['securitesocial']);
                formData.append('courseClients[' + i + '][typemutuelle]', arr[i]['typemutuelle']);
                formData.append('courseClients[' + i + '][duree]', arr[i]['duree']);
                formData.append('courseClients[' + i + '][distance]', arr[i]['distance']);
                formData.append('courseClients[' + i + '][value]', arr[i]['value']);
            }


            this.courseService.updatecourseadmin(formData).subscribe(res => {


                this.presentToast();
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        image: this.userloged.filename,
                        nom: this.userloged.nom,
                        prenom: this.userloged.prenom

                    }
                };
                this.navCtrl.navigateForward(['/tabs/home'], navigationExtras);

            }, error => {
                this.presentToastErreur();
            });
        } else {
            this.presentToastErreuclient();
            return;
        }


    }


    clickautredepart($event, id) {
        const courseClient = this.courseForm.get('courseClients') as FormArray;
        if ($event.detail.value === ' autre ') {
            $('#adresseinput_' + id).val('');
            $('#depart' + id).removeAttr('name');
            $('#depart' + id).css('display', 'none');
            $('#depart' + id).removeAttr('name');
            $('#adresseinput_' + id).css('display', '');

        } else {
            this.calculateAndDisplayRoute(courseClient.at(id).get('depart').value, courseClient.at(id).get('destination').value, id);
        }

    }

    clickautredistination($event, id) {
        const courseClient = this.courseForm.get('courseClients') as FormArray;
        if ($event.detail.value === ' autre ') {
            $('#arriveinput_' + id).val('');
            $('#destination' + id).removeAttr('name');
            $('#destination' + id).css('display', 'none');
            $('#destination' + id).removeAttr('name');
            $('#arriveinput_' + id).css('display', '');
        } else {
            this.calculateAndDisplayRoute(courseClient.at(id).get('depart').value, courseClient.at(id).get('destination').value, id);
        }

    }

    departOnChnage(i) {

        const courseClient = this.courseForm.get('courseClients') as FormArray;
        this.closecard = 'depart' + i;
        if (courseClient.at(i).get('depart').value) {
            const service = new window['google'].maps.places.AutocompleteService();
            service.getPlacePredictions({
                input: courseClient.at(i).get('depart').value,
                componentRestrictions: {country: 'FR'}
            }, (predictions, status) => {
                this.autocompleteItems = [];
                this.__zone.run(() => {
                    if (predictions != null) {
                        predictions.forEach((prediction) => {
                            this.autocompleteItems.push(prediction.description);
                        });
                    }
                });
            });
        }

    }

    destinationChnage(i) {

        const courseClient = this.courseForm.get('courseClients') as FormArray;
        this.closecard1 = 'destination' + i;
        if (courseClient.at(i).get('destination').value) {
            const service = new window['google'].maps.places.AutocompleteService();
            service.getPlacePredictions({
                input: courseClient.at(i).get('destination').value,
                componentRestrictions: {country: 'FR'}
            }, (predictions, status) => {
                this.autocompleteItems = [];
                this.__zone.run(() => {
                    if (predictions != null) {
                        predictions.forEach((prediction) => {
                            this.autocompleteItems.push(prediction.description);

                        });
                    }
                });
            });
        }

    }

    choosedepart(depart, id) {
        const courseClient = this.courseForm.get('courseClients') as FormArray;
        courseClient.at(id).patchValue({
            depart: depart

        });
        this.closecard = '';
        this.calculateAndDisplayRoute(courseClient.at(id).get('depart').value, courseClient.at(id).get('destination').value, id);
    }

    choosedestination(destination, id) {
        const courseClient = this.courseForm.get('courseClients') as FormArray;
        courseClient.at(id).patchValue({
            destination: destination

        });
        this.closecard1 = '';
        this.calculateAndDisplayRoute(courseClient.at(id).get('depart').value, courseClient.at(id).get('destination').value, id);

    }


    async alerttypeclient() {

        const alert = await this.alertCtrl.create({
            header: 'Voulez-vous choisir le type de client',


            buttons: [
                {
                    text: 'Fermer',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: status => {
                    }

                }
            ]
        });
        return await alert.present();
    }

    alertselect(type) {
        if (type === '') {
            this.alerttypeclient();
        }

    }


    ionViewDidLeave() {


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

    delete(index, id) {
        if (id) {
            this.clients().removeAt(index);
            this.courseClient.delleteCourseClientById(id).subscribe(res => {
                // console.log('course client supprime');
            });
        } else {
            this.clients().removeAt(index);
        }

    }

    async confirmsupprision(index, idcourseclient) {
        const alert = await this.alertCtrl.create({
            header: 'Suppression de Client:',
            message: 'Vous êtes sûr de supprimer cet Client!!',
            mode: 'ios',

            buttons: [
                {
                    text: 'Fermer',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: status => {
                    }
                }, {
                    text: 'Supprimer',
                    handler: () => {

                        this.delete(index, idcourseclient);

                    }
                }
            ]


        });
        return await alert.present();
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


}
