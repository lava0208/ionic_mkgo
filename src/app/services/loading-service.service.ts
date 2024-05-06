import { Injectable } from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {

  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  async showLoading(message?: string) {
    this.isLoading = true;
    this.loadingController.create({
      message: message ? message : 'Please wait...'
    }).then(loader => {
      loader.present().then(() => {
        if (!this.isLoading) {
          loader.dismiss();
        }
      });
    });
  }

  async hideLoading() {
    this.isLoading = false;
    this.loadingController.getTop().then(loader => {
      if (loader) {
        loader.dismiss();
      }
    });
  }
}
