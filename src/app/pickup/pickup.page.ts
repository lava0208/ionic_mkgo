import {
    ActionSheetController,
    AlertController,
    IonSlides,
    ModalController,
    NavController,
    Platform,
    PopoverController,
    ToastController
} from '@ionic/angular';
import {Component, EventEmitter, NgZone, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {AddclientmodalPage} from '../addclientmodal/addclientmodal.page';


import * as moment from 'moment';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {EntrepriseService} from '../services/entreprise.service';
import {ClientService} from '../services/client.service';
import {CourseService} from '../services/course.service';
import {UserService} from '../services/user.service';
import {Location} from '@angular/common';
import { AddModalTrajetClientComponent } from '../modals/add-modal-trajet-client/add-modal-trajet-client.component';
import { StorageService } from '../services/storage/storage.service';
import { DatePicker } from '@ionic-native/date-picker/ngx';

declare var google;

@Component({
    selector: 'app-pickup',
    templateUrl: './pickup.page.html',
    styleUrls: ['./pickup.page.scss'],
})
export class PickupPage implements OnInit, OnDestroy {

    user:any;

    isLoaded:Boolean = false;
 
    directionsService = new google.maps.DirectionsService;
    autocompleteItems = [];
    item: any;
    myDate;
    types;
    modepayments: Array<any>;
    listlicence;
    listentreprise;
    listclients;
    num = 0;
    mode;
    destLoc: any;
    pickup: boolean;
    closecard;
    closecard1;

    terms;
    start;
    client;
    depart = '';
    destination = '';
    tel;
    numSecusocial;
    mutuelle;
    entreprise;
    clientres;
    courseForm: FormGroup;
    courseClients: FormArray;
    userconnectee;
    showselect = false;
    nometprenomclient;

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

    submited = false;
    datetimeobligatoire = false;
    newclient = false;
    trajetsClient : any[] = [];
    @ViewChildren(IonSlides) slides: QueryList<IonSlides>; // <-- here!

    
    listadresse;
    clientmodal;

    disp;
    heurecourse;
    customPickerOptions;

    monthShortNames;
    selectedRadioGroup = false;

    position;

    constructor(
        public alertCtrl: AlertController, 
        public navCtrl: NavController, 
        public actionSheetCtrl: ActionSheetController,
        private __zone: NgZone,
         private toastController: ToastController,
        public camera: Camera,
        public formBuilder: FormBuilder,
         private userservices: UserService,
        private entrepriseService: EntrepriseService,
        public clientService: ClientService,
         private location: Location,
        private popoverController: PopoverController,
        public modalCtrl: ModalController,
         private keyboard: Keyboard,
        public route: Router,
        private platform: Platform,
        private courseService: CourseService,
        private storageService: StorageService,
        private datePicker: DatePicker,

                ) {

  



    }

    async ngOnInit() {

        var locale = 'fr-ca';

        moment.locale(locale);

        this.courseForm = this.formBuilder.group({
            licence: new FormControl('', [
                Validators.required
            ]),
            commentaire: new FormControl(''),
            medical: new FormControl('', [
                Validators.required
            ]),
            tarif: new FormControl(''),
            paiement: new FormControl('En compte'),
            entreprise: new FormControl(''),
            start: new FormControl('', Validators.compose([
                Validators.required,
              ])),
            kilometrage: new FormControl(''),
            userid: null,
            courseClients: this.formBuilder.array([

            ])
        });

        //init storage
        await this.storageService.init();
        //init storage
        this.user = JSON.parse(await this.storageService.get('currentClientUser'));
        console.log('currentClientUser', this.user)
        if(this.user && this.user.id)
        {

            this.clientService.getusersbyId(this.user.id).subscribe(res => {
                console.log('addcourse.ts', res);
                this.userloged = res;
                this.courseForm.patchValue({
                    userid:this.user.id,
                })
            });
    
    
            this.userconnectee = this.user.id;

    
            this.monthShortNames = moment.monthsShort();
            this.userconnectee = this.user.id;
            setInterval(() => {
                this.getonedispatcher();
                //this.getprofile();
            }, 30000);
    
    
            //this.getprofile();
    
            await this.getalltypeclient();
            await this.clientService.getonedispatcher().subscribe(res => {
                console.log('disp', res);
                this.dispatcher = res[0];
            });
    
            this.pickup = true;
            this.modepayments = [
    
                'CB',
                'ESP',
                'En compte',
            ];


    
            await this.forkJoin();
        }
        else
        {
            this.isLoaded = false;
        }






    }

    async forkJoin()
    {
        await this.getalllicences();
        await this.getallentreprise();
        this.isLoaded = true;
    }

    get licence() {
        return this.courseForm.get('licence');
    }

    get medical() {
        return this.courseForm.get('medical');
    }

    ondispatch($event) {


        this.clientService.getonedispatcher().subscribe((users: any) => {
            console.log('users===================>', users);
            for (let i = 0; i < users.length; i++) {
                console.log('users===================>', users[i]['id']);
                this.userservices.updateuserr(users[i]['id'], {
                    'dispatch': 'false'
                }).then(res1 => {

                });
            }
        });
        const data = {
            'dispatch': $event.returnValue.toString()
        };

        this.userservices.updateuserr(this.user.id, {
            'dispatch': $event.returnValue.toString()
        }).then(res => {


            //this.getprofile();
            this.getonedispatcher();


        });
    }

    /*getprofile() {
        this.userservices.getprofile(localStorage.getItem('useridadmin')).subscribe(res1 => {
            this.disp = res1['dispatch'];
            this.userconnectee = res1;
        });
    }*/

    getonedispatcher() {
        this.clientService.getonedispatcher().subscribe((res: any) => {

            this.dispatcher = res[0];

        });
        console.log('ici dispatch');
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

    async getalltypeclient() {
        await this.clientService.getalltypeclient().subscribe(res => {
            this.types = res['hydra:member'];
            console.log('types',this.types)
        });
    }


    addItem(): void {
        this.courseClients = this.courseForm.get('courseClients') as FormArray;
        this.courseClients.push(this.createItem());
    }

    createItem(): FormGroup {
        return this.formBuilder.group({
            trajet:'',
            tel: '',
            destination: '',
            depart: '',
            course: '',
            client: '',
            securitesocial: '',
            typemutuelle: '',
            distance: '',
            duree: '',
            dureetext: '',
            tarif:''
        });
    }

    cancel() {
        this.location.back();
    }

    async getalllicences() {
        await this.entrepriseService.getalllicences().subscribe(res => {
            this.listlicence = res['hydra:member'];
            console.log('listlicence', this.listlicence)
        });
    }


    async getallentreprise() {
        await this.entrepriseService.getallentreprise().subscribe(res => {
            this.listentreprise = res['hydra:member'];
            console.log('listentreprise', this.listentreprise)
        });
    }

    clients(): FormArray {
        return this.courseForm.get('courseClients') as FormArray;
    }

    getallclient(e) {
        console.log('type',e)
        let type = e.detail.value
        if(!type)
        return;
        const control = this.courseForm.get('courseClients') as FormArray;
        console.log('***control***',control.value.length)

        for(let i=0;i<=control.value.length;i++)
        {
            control.removeAt(i);
        }
        //reset trajet
        this.trajetsClient = [];
        this.selectedRadioGroup = true;
        if(type)
        {
            this.clientService.getclientbytype(type).subscribe(res => {
                console.log('listclients', res);
                this.listclients = res;
                //this.addItem()
            });
        }

    }

    getallclientFromAddTrajet(type) {

        const control = this.courseForm.get('courseClients') as FormArray;
        console.log('***control***',control.value.length)

        for(let i=0;i<=control.value.length;i++)
        {
            control.removeAt(i);
        }
        //reset trajet
        this.trajetsClient = [];
        this.selectedRadioGroup = true;
        if(type)
        {
            this.clientService.getclientbytype(type).subscribe(res => {
                console.log('listclients', res);
                this.listclients = res;
                //this.addItem()
            });
        }

    }


    dismiss() {

        this.modalCtrl.dismiss();

    }


    async presentModal(e, type, i) {
        console.log('type', type);
        if (type) {
            this.indexmodal = i;

            this.showselect = true;

            const modal = await this.modalCtrl.create({
                component: AddclientmodalPage,
                cssClass: 'prop-modal5',
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




  async presentModalTrajet(e,obj: any,i) {
    e.stopPropagation();
    const eventEmitter= new EventEmitter();
    eventEmitter.subscribe(res=>{
      console.log('emitterResult', res);
      if(res)
      {
        this.getallclientFromAddTrajet(this.courseForm.get('medical').value);
      }
    });
    const modal = await this.modalCtrl.create({
      component: AddModalTrajetClientComponent,
      cssClass: 'custom-modal-trajet',

      //initialBreakpoint: 0.5,
      //breakpoints: [0, 0.5, 1],
      componentProps: {
        obj,
        filterStatus: true,
        middleInitial: 'N',
        changeSuccess: eventEmitter
      }
    });
    return await modal.present();
  }


    getclientatermodal(index, id) {

        this.clientService.getclientbytype(this.courseForm.get('medical').value).subscribe(res => {
            console.log('listclients', res);
            this.listclients = res;
            let client = this.listclients.find((x)=>{
                return x.id == id
            })
            console.log('client',client);
            this.clients().at(index).patchValue({
                client: client
            });

            this.newcourseclient(index, client)
        });


        this.showselect = false;

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
        console.log('listadresse', this.listadresse);
    }

    addTrajet()
    {
        console.log('oki')
    }

    public async slideChanged(i: number,client){
        console.log(`Slider ${i} changed`);
    
        // Iterate over the list of sliders to get all the selected indexes
        this.slides.toArray().forEach(async (slider, index) => {
          console.log(`Slider ${index} selected index: ${await slider.getActiveIndex()}`);
          let activeIndex = await slider.getActiveIndex();
          console.log('after delete',this.trajetsClient)

          let t = this.trajetsClient[index][activeIndex];
          this.clients().at(index).patchValue({
              trajet:t.id,
              depart: t.depart,
              destination: t.arrive,
              tel: client.tel,
              securitesocial: client.securitesociale,
              typemutuelle: client.mutuelle,
              dureetext:t.dureetext,
              duree:t.duree,
              distance:t.km,
              tarif:t.tarif
          });
        })
      }

    /*slideChanged(i,client)
    {

        this.slides.getActiveIndex().then(data => {
            console.log('slide index',data)
            console.log('i',i)
            console.log('trajetsClient',this.trajetsClient)
            console.log('slide',this.trajetsClient[i][data])
            if(this.trajetsClient[i][data])
            {
                let t = this.trajetsClient[i][data];
                this.clients().at(i).patchValue({
                    trajet:t.id,
                    depart: t.depart,
                    destination: t.arrive,
                    tel: client.tel,
                    securitesocial: client.securitesociale,
                    typemutuelle: client.mutuelle,
                    dureetext:t.dureetext,
                    distance:t.km,
                    tarif:t.tarif
                });
            }
        })

    }*/

    newcourseclient(id, client) {
        this.newclient = true;
        this.trajetsClient[id] = client.trajets;
        console.log('trajetsClient',this.trajetsClient)
        if(this.trajetsClient[id][0])
        {
            let t = this.trajetsClient[id][0];
            this.clients().at(id).patchValue({
                trajet:t.id,
                depart: t.depart,
                destination: t.arrive,
                tel: client.tel,
                securitesocial: client.securitesociale,
                typemutuelle: client.mutuelle,
                dureetext:t.dureetext,
                duree:t.duree,
                distance:t.km,
                tarif:t.tarif
            });
        }
        console.log('client',client)
        /*this.getlistadresse(client);
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
        document.getElementById('depart' + id).setAttribute('placeholder', depart?depart:'');
        // document.getElementById('depart' + id).setAttribute('value', this.courseForm.value.courseClients[id].client['titre1'] + ':' + this.courseForm.value.courseClients[id].client['adresse1']);
        // document.getElementById('depart' + id).setAttribute('value', this.courseForm.value.courseClients[id].client['titre1'] + ':' + this.courseForm.value.courseClients[id].client['adresse1']);
        document.getElementById('destination' + id).setAttribute('placeholder', destination?destination:'');
        document.getElementById('departmodif' + id).style.display = 'none';
        document.getElementById('destinationmodif' + id).style.display = 'none';
        document.getElementById('client' + id).setAttribute('value', client.id);

        $('#adresseinput_' + id).css('display', 'none');
        $('#arriveinput_' + id).css('display', 'none');
        console.log(this.courseForm.value);*/
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Course créée avec succès!',
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

    async presentToastErreuTrajet(i) {
        const toast = await this.toastController.create({
            message: 'Pas de trajet => Client N° '+ parseInt(i + 1),
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

    async onSubmit() {
        this.datetimeobligatoire = true;
        this.submited = true;
        console.log('***courseForm***',this.courseForm.value);

        if(this.courseForm.invalid) {
            this.submited = false;
            return;
          }

        this.datetimeobligatoire = false;
        console.log('soursefile1', this.soursefile1);
        console.log('soursefile2', this.soursefile2);


        const date = this.courseForm.get('start').value;
        console.log('date',date)
        /*const momentDate = moment(date.toISOString());
        console.log('momentDate',momentDate)*/
        const formData = this.toFormData(this.courseForm.value);
        formData.delete('start');
        formData.append('start', moment(date).format('YYYY-MM-DDTHH:mm'));

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
            formData.append('employe', null);
            formData.append('heurecourse', this.heurecourse);
            formData.append('userid', this.user.id);
            const arr = this.courseForm.get('courseClients').value;
            for (let i = 0; i < arr.length; i++) {
                if(!this.trajetsClient[i][0])
                {
                    this.presentToastErreuTrajet(i);
                    this.submited = false;
                    return;
                }
                formData.append('courseClients[' + i + '][trajet]', arr[i]['trajet']);
                formData.append('courseClients[' + i + '][tel]', arr[i]['tel']);
                formData.append('courseClients[' + i + '][destination]', arr[i]['destination']);
                formData.append('courseClients[' + i + '][depart]', arr[i]['depart']);
                formData.append('courseClients[' + i + '][client]', arr[i]['client']['id']);
                formData.append('courseClients[' + i + '][numSecusocial]', arr[i]['securitesocial']);
                formData.append('courseClients[' + i + '][mutuelle]', arr[i]['typemutuelle']);
                formData.append('courseClients[' + i + '][duree]', arr[i]['duree']);
                formData.append('courseClients[' + i + '][distance]', arr[i]['distance']);
                formData.append('courseClients[' + i + '][dureetext]', arr[i]['dureetext']);
            }

            this.courseService.addcourse(formData).subscribe(res => {

                this.presentToast();
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        image: this.userloged.filename,
                        nom: this.userloged.nom,
                        prenom: this.userloged.prenom

                    }
                };


                this.imageFileName1 = '';
                this.imageFileName2 = '';
                this.filesToUpload1 = undefined;
                this.filesToUpload2 = undefined;
                this.courseForm.reset();
                this.clients().reset();
                this.selectedRadioGroup = false;
                this.myDateNTime = '';
                //reset btn submitted
                this.submited = false;

                //document.getElementById('depart0').setAttribute('placeholder', '');
                //document.getElementById('destination0').setAttribute('placeholder', '');


                this.navCtrl.navigateForward(['/tabs/home'], navigationExtras);

            }, error => {
                this.presentToastErreur();
                this.submited = false;
            });
        } else {
            this.presentToastErreuclient();
            this.submited = false;
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
        console.log('departOnChnage', courseClient.at(i).get('depart').value);
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
        console.log('destinationChnage', courseClient.at(i).get('depart').value);
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


        this.clients().at(id).patchValue({
            depart: depart

        });
        this.calculateAndDisplayRoute(courseClient.at(id).get('depart').value, courseClient.at(id).get('destination').value, id);
        this.closecard = '';
    }

    choosedestination(destination, id) {
        const courseClient = this.courseForm.get('courseClients') as FormArray;

        this.clients().at(id).patchValue({
            destination: destination

        });
        this.calculateAndDisplayRoute(courseClient.at(id).get('depart').value, courseClient.at(id).get('destination').value, id);
        this.closecard1 = '';

    }

    delete(index) {
        this.clients().removeAt(index);
        let filter = this.trajetsClient.filter((x,i)=>{
            return i != index
        });
        console.log('res delete', filter)
        this.trajetsClient = filter;
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


    ngOnDestroy() {
        this.submited = false;
        this.courseForm.reset();
    }

    ionViewDidEnter() {
        //this.courseForm.reset();
        this.imageFileName1 = '';
        this.imageFileName2 = '';
        this.filesToUpload1 = undefined;
        this.filesToUpload2 = undefined;
        this.myDateNTime = '';
        this.courseForm.reset();
        this.courseForm.patchValue({
            start:moment().format(),
        });
        console.log('courseForm',this.courseForm.value)

        //init trajetsClient
        this.trajetsClient = [];
        console.log('trajetsClient*** init',this.trajetsClient)

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
            console.log(this.filesToUpload2);
        } else {
            console.log(this.filesToUpload2);
            console.log('type non valide ');
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
            console.log('library');
            this.soursefile1 = 'library';
            document.getElementById('file-input1').click();
            // const libraryImage = await this.openLibrary();
            // this.filesToUpload1 = 'data:image/jpg;base64,' + libraryImage;
            // this.imageFileName1 = new Date().getTime() + '.jpg';
        } else {
            console.log('camera');
            this.soursefile1 = 'camera';
            const cameraImage = await this.openCamera();
            const base641 = await fetch('data:image/jpg;base64,' + cameraImage);
            this.filesToUpload1 = await base641.blob();
            this.imageFileName1 = new Date().getTime() + '.jpg';
        }
        console.log(this.filesToUpload1);
    }

    async addPhoto2(source: string) {
        if (source === 'library') {
            console.log('library');
            this.soursefile2 = 'library';
            document.getElementById('file-input2').click();
            // const libraryImage = await this.openLibrary();
            // this.filesToUpload2 = 'data:image/jpg;base64,' + libraryImage;
            // this.imageFileName2 = new Date().getTime() + '.jpg';
        } else {
            console.log('camera');
            this.soursefile2 = 'camera';
            const cameraImage = await this.openCamera();
            const base641 = await fetch('data:image/jpg;base64,' + cameraImage);
            this.filesToUpload2 = await base641.blob();
            this.imageFileName2 = new Date().getTime() + '.jpg';
        }
        console.log(this.filesToUpload2);
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
                        console.log('ok');
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
                        console.log('ok');
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

    calculateAndDisplayRoute(origin, destination, index) {
        console.log(origin, location);
        this.directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING'
        }, (response, status) => {

            if (status === 'OK') {
                console.log(response);
                console.log(response.routes[0].legs[0].distance);
                console.log(response.routes[0].legs[0].duration);
                this.clients().at(index).patchValue({
                    dureetext: response.routes[0].legs[0].duration['text'],
                    distance: response.routes[0].legs[0].distance['text'],
                    duree: response.routes[0].legs[0].duration['value']
                });
            }
        });

    }

    momentDateFr(e)
    {
      //let date = new Date(e.target.value).toISOString().substring(0, 10);
      console.log('date',moment(e.target.value).format('YYYY-MM-DD HH:mm'));
      const d = moment(e.target.value).format('YYYY-MM-DD HH:mm');
      this.courseForm.patchValue(
        {
            start:d
        }
      );
      //console.log('start',moment(this.courseForm.get('start').value).format('YYYY-MM-DDTHH:mm'))

      return d.toString();
    }

    async refreshModal()
    {
      console.log(this.modalCtrl)
      await this.modalCtrl.dismiss();
    }
}


