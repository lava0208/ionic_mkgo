/**
 * Car Pool starter (https://store.enappd.com/product/blablacar-cloneionic-4-car-pooling-app-starter)
 *
 * Copyright © 2019-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {PickupPage} from './pickup.page';
import {ShareableModule} from '../shareable/shareable.module';
import {HttpClientModule} from '@angular/common/http';
import {CourseService} from '../services/course.service';
import {CourseClientService} from '../services/course-client.service';
import {EntrepriseService} from '../services/entreprise.service';
import {ClientService} from '../services/client.service';


import {DatePicker} from '@ionic-native/date-picker/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {IonicSelectableModule} from 'ionic-selectable';
import { AddModalTrajetClientComponent } from '../modals/add-modal-trajet-client/add-modal-trajet-client.component';
import { AddModalTrajetClientModule } from '../modals/add-modal-trajet-client/add-modal-trajet-client.module';


const routes: Routes = [
    {
        path: '',
        component: PickupPage
    }
];

@NgModule({
    imports: [
        CommonModule, ShareableModule, HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule, 
        RouterModule.forChild(routes), IonicSelectableModule,AddModalTrajetClientModule
    ],
    providers: [CourseService, Keyboard, DatePicker, CourseClientService, EntrepriseService, ClientService],
    entryComponents: [AddModalTrajetClientComponent],
    declarations: [PickupPage],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
})
export class PickupPageModule {
}
