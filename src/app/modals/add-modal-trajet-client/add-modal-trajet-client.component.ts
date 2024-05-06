import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ClientService } from 'src/app/services/client.service';
import { CourseService } from 'src/app/services/course.service';
declare var google;

@Component({
  selector: 'app-add-modal-trajet-client',
  templateUrl: './add-modal-trajet-client.component.html',
  styleUrls: ['./add-modal-trajet-client.component.scss'],
})
export class AddModalTrajetClientComponent implements OnInit {

  @Input() obj: any;
  finalChangeStatus:Boolean = false;
  @Output()
  changeSuccess: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  addGroupForm: FormGroup;
  submitted = false;
  isLoaded:Boolean = false;
  adresses:any[] = [];
  autocompleteItemsDepart = [];
  autocompleteItemsDestination = [];

  directionsService = new google.maps.DirectionsService;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    public clientService: ClientService,
    public CourseService: CourseService,
    private __zone: NgZone,
  ) { }

  async ngOnInit() {
    // form init************************
    this.addGroupForm = this.formBuilder.group({
      nom: ['', Validators.required],
      depart: ['', Validators.required],
      destination: ['', Validators.required],
      client: ['', Validators.required],
      duree: ['', Validators.required],
      dureetext: new FormControl(),
      tarif: new FormControl(),
      distance: new FormControl(),
    });
    console.log('obj',this.obj)
    this.addGroupForm.patchValue({
      nom: '',
      depart:'',
      destination: '',
      client: this.obj.id,
      duree: '',
      dureetext: '',
      tarif: '',
      distance:''
      //heure : new Date(0).toISOString(),
     // heure : moment(new Date()).format("HH:mm")
    })

    await this.forkJoin();


  }

  async forkJoin()
  {
    this.isLoaded = false;

      await this.getallAdresses(this.obj.id);
      this.isLoaded = true;
  }

  departOnChnage() {
    const service = new window['google'].maps.places.AutocompleteService();

    service.getPlacePredictions({
        input: this.addGroupForm.get('depart').value,
        componentRestrictions: {country: 'FR'}
    }, (predictions, status) => {
        this.autocompleteItemsDepart = [];
        this.__zone.run(() => {
            if (predictions != null) {
                predictions.forEach((prediction) => {
                    this.autocompleteItemsDepart.push(prediction.description);
                    console.log('autocompleteItemsDepart',this.autocompleteItemsDepart)

                });
            }
        });
    });
}

destinationOnChnage() {
  const service = new window['google'].maps.places.AutocompleteService();

  service.getPlacePredictions({
      input: this.addGroupForm.get('arrive').value,
      componentRestrictions: {country: 'FR'}
  }, (predictions, status) => {
      this.autocompleteItemsDestination = [];
      this.__zone.run(() => {
          if (predictions != null) {
              predictions.forEach((prediction) => {
                  this.autocompleteItemsDestination.push(prediction.description);
                  console.log('autocompleteItemsDestination',this.autocompleteItemsDestination)

              });
          }
      });
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

async getallAdresses(id:Number) {
    await this.clientService.getallAdresses(id).then(res => {
        this.adresses = res
        console.log('adresses', res)
    });
}


focusHandler(event,label)
{
  console.log('****event',event.target.value)

  switch (label) {
    case 'depart':
      this.addGroupForm.patchValue({
        depart : event.target.value,
      });
      this.calculateAndDisplayRoute(this.addGroupForm.get('depart').value,this.addGroupForm.get('destination').value,0)
    break;

    case 'destination':
      this.addGroupForm.patchValue({
        destination : event.target.value,
      });
      this.calculateAndDisplayRoute(this.addGroupForm.get('depart').value,this.addGroupForm.get('destination').value,0)
      break;

    default:
      break;
  }
  console.log('addGroupForm',this.addGroupForm.value);

}

calculateAndDisplayRoute(origin, destination, index) {
  console.log('origin',origin)

  this.directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING'
  }, (response, status) => {

    console.log('response',response)
    if (status === 'OK') {

      this.addGroupForm.patchValue({
          dureetext: response.routes[0].legs[0].duration['text'],
          distance: response.routes[0].legs[0].distance['text'],
          duree: response.routes[0].legs[0].duration['value']
      });
  }

  });

}


  async submitForm() {
    this.submitted = true;
    console.log('addGroupForm',this.addGroupForm.value);
      // stop here if form is invalid
    if(this.addGroupForm.invalid) {
        this.submitted = false;
        return;
    }

    await this.CourseService.addTrajetClient(this.addGroupForm.value).then(async (data) => {
        console.log('data',data)
        if(data == 'true')
        {
          this.changeSuccess.emit(true);
          this.dismiss()
        }
        else{
          alert('Erreur trajet');
        }
    }).catch((err)=>{
      console.log('err',err)
    });

  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
