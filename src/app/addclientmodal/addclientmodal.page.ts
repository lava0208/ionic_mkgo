import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController, NavParams, PopoverController, ToastController} from '@ionic/angular';
import {ClientService} from '../services/client.service';

@Component({
    selector: 'app-addclientmodal',
    templateUrl: './addclientmodal.page.html',
    styleUrls: ['./addclientmodal.page.scss'],
})
export class AddclientmodalPage implements OnInit {
    clientform: FormGroup;
    closecard;
    closecard1;
    closecard2;
    closecard3;
    closecard4;
    closecard5;
    autocompleteItems = [];
    autocompleteItems2 = [];
    autocompleteItems3 = [];
    autocompleteItems4 = [];
    autocompleteItems5 = [];
    typeclient;
    idclient;
    etat;
    submited = false;

    constructor(public viewCtrl: ModalController, private toastController: ToastController, private clientservice: ClientService,
                private navParams: NavParams, private popoverController: PopoverController, private formBuilder: FormBuilder, private __zone: NgZone) {
    }

    get f() {
        return this.clientform.controls;
    }

    ngOnInit() {
        this.typeclient = this.navParams.get('typeclient');

        console.log('typeclient', this.typeclient);
        this.clientform = this.formBuilder.group({
            nom: '',
            prenom: '',
            tel: '',
            typeclient: '/api/typeclients/' + this.typeclient,
            adresse: ['', Validators.required],
            adresse2: '',
            adresse3: '',
            adresse4: '',
            adresse5: '',
            titre1: '',
            titre2: '',
            titre3: '',
            titre4: '',
            titre5: '',
            numSecusocial: '',
            mutuelle: '',
            active: 'true'

        });
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

    chooseItem1(pickup) {
        document.getElementById('depar1').setAttribute('value', pickup);
        this.closecard1 = '';
    }

    chooseItem(pickup) {
        document.getElementById('depa1').setAttribute('value', pickup);
        this.closecard = '';
    }

    searcOnChnage1() {

        this.closecard1 = 'depar1';
        if (document.getElementById('carddestination1')['style']['display'] === 'none') {
            document.getElementById('carddestination1')['style']['display'] = 'block';
        } else {
            document.getElementById('carddestination1')['style']['display'] = 'none';
        }
        if (document.getElementById('depar1').getElementsByTagName('input')[0].value) {
            const service = new window['google'].maps.places.AutocompleteService();
            service.getPlacePredictions({
                input: document.getElementById('depar1').getElementsByTagName('input')[0].value,
                componentRestrictions: {country: 'FR'}
            }, (predictions, status) => {
                this.autocompleteItems = [];
                this.__zone.run(() => {
                    if (predictions != null) {
                        console.log(predictions);
                        predictions.forEach((prediction) => {
                            this.autocompleteItems.push(prediction.description);
                        });
                    }
                });
            });
        }

    }

    searcOnChnage() {

        this.closecard = 'depa1';
        if (document.getElementById('carddestination')['style']['display'] === 'none') {
            document.getElementById('carddestination')['style']['display'] = 'block';
        } else {
            document.getElementById('carddestination')['style']['display'] = 'none';
        }
        if (document.getElementById('depa1').getElementsByTagName('input')[0].value) {
            const service = new window['google'].maps.places.AutocompleteService();
            service.getPlacePredictions({
                input: document.getElementById('depa1').getElementsByTagName('input')[0].value,
                componentRestrictions: {country: 'FR'}
            }, (predictions, status) => {
                this.autocompleteItems = [];
                this.__zone.run(() => {
                    if (predictions != null) {
                        console.log(predictions);
                        predictions.forEach((prediction) => {
                            this.autocompleteItems.push(prediction.description);
                        });
                    }
                });
            });
        }

    }

    chooseItem2(pickup) {
        document.getElementById('depart2').setAttribute('value', pickup);
        this.closecard2 = '';
    }

    searcOnChnage2() {

        this.closecard2 = 'depart2';
        if (document.getElementById('carddestination2')['style']['display'] === 'none') {
            document.getElementById('carddestination2')['style']['display'] = 'block';
        } else {
            document.getElementById('carddestination2')['style']['display'] = 'none';
        }
        if (document.getElementById('depart2').getElementsByTagName('input')[0].value) {
            const service = new window['google'].maps.places.AutocompleteService();
            service.getPlacePredictions({
                input: document.getElementById('depart2').getElementsByTagName('input')[0].value,
                componentRestrictions: {country: 'FR'}
            }, (predictions, status) => {
                this.autocompleteItems2 = [];
                this.__zone.run(() => {
                    if (predictions != null) {
                        predictions.forEach((prediction) => {
                            this.autocompleteItems2.push(prediction.description);
                        });
                    }
                });
            });
        }

    }

    chooseItem3(pickup) {
        document.getElementById('depart3').setAttribute('value', pickup);
        this.closecard3 = '';
    }

    searcOnChnage3() {

        this.closecard3 = 'depart3';
        if (document.getElementById('carddestination3')['style']['display'] === 'none') {
            document.getElementById('carddestination3')['style']['display'] = 'block';
        } else {
            document.getElementById('carddestination3')['style']['display'] = 'none';
        }
        if (document.getElementById('depart3').getElementsByTagName('input')[0].value) {
            const service = new window['google'].maps.places.AutocompleteService();
            service.getPlacePredictions({
                input: document.getElementById('depart3').getElementsByTagName('input')[0].value,
                componentRestrictions: {country: 'FR'}
            }, (predictions, status) => {
                this.autocompleteItems3 = [];
                this.__zone.run(() => {
                    if (predictions != null) {
                        predictions.forEach((prediction) => {
                            this.autocompleteItems3.push(prediction.description);
                        });
                    }
                });
            });
        }

    }

    chooseItem4(pickup) {
        document.getElementById('depart4').setAttribute('value', pickup);
        this.closecard4 = '';
    }

    searcOnChnage4() {

        this.closecard4 = 'depart4';
        if (document.getElementById('carddestination4')['style']['display'] === 'none') {
            document.getElementById('carddestination4')['style']['display'] = 'block';
        } else {
            document.getElementById('carddestination4')['style']['display'] = 'none';
        }
        if (document.getElementById('depart4').getElementsByTagName('input')[0].value) {
            const service = new window['google'].maps.places.AutocompleteService();
            service.getPlacePredictions({
                input: document.getElementById('depart4').getElementsByTagName('input')[0].value,
                componentRestrictions: {country: 'FR'}
            }, (predictions, status) => {
                this.autocompleteItems4 = [];
                this.__zone.run(() => {
                    if (predictions != null) {
                        predictions.forEach((prediction) => {
                            this.autocompleteItems4.push(prediction.description);
                        });
                    }
                });
            });
        }

    }

    chooseItem5(pickup) {
        document.getElementById('depart5').setAttribute('value', pickup);
        this.closecard5 = '';
    }

    searcOnChnage5() {

        this.closecard5 = 'depart5';
        if (document.getElementById('carddestination5')['style']['display'] === 'none') {
            document.getElementById('carddestination5')['style']['display'] = 'block';
        } else {
            document.getElementById('carddestination5')['style']['display'] = 'none';
        }
        if (document.getElementById('depart5').getElementsByTagName('input')[0].value) {
            const service = new window['google'].maps.places.AutocompleteService();
            service.getPlacePredictions({
                input: document.getElementById('depart5').getElementsByTagName('input')[0].value,
                componentRestrictions: {country: 'FR'}
            }, (predictions, status) => {
                this.autocompleteItems5 = [];
                this.__zone.run(() => {
                    if (predictions != null) {
                        predictions.forEach((prediction) => {
                            this.autocompleteItems5.push(prediction.description);
                        });
                    }
                });
            });
        }

    }


    add() {
        this.submited = true;

        // stop here if form is invalid
        if (this.clientform.invalid) {
            return;
        }
        console.log(this.clientform.value);
        this.clientservice.addclient(this.clientform.value).subscribe(res => {
            //add adresse 0
            if(res['titre1'] != '')
            this.clientservice.addAdresse({client:'/api/clients/'+res['id'],titre:res['titre1'],adresse:res['adresse']}).subscribe()
            //add adresse 2 ... 5

            for(let i = 2;i<=5;i++)
            {
                if(res['titre'+i] != '')
                this.clientservice.addAdresse({client:'/api/clients/'+res['id'],titre:res['titre'+i],adresse:res['adresse'+i]}).subscribe()
            }
            this.idclient = res['id'];
            this.presentToast();
            this.etat = 'add';
            this.closePopoveradd(this.idclient, this.etat);
        });

    }

    async closePopoveradd(item1?, item2?) {
        console.log(item1, item2);
        const data = item1;
        const data1 = item2;
        const modal = await this.viewCtrl.getTop();
        modal.dismiss(data, data1);

    }

    async closePopover() {
        this.etat = 'fermer';
        const modal = await this.viewCtrl.getTop();
        modal.dismiss('', this.etat);

    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Client créée avec succès!',
            duration: 2000
        });
        toast.present();
    }


}
