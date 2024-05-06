/**
 * Car Pool starter (https://store.enappd.com/product/blablacar-cloneionic-4-car-pooling-app-starter)
 *
 * Copyright © 2019-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {LoginformPage} from './loginform.page';
import {AuthentificationService} from '../services/authentification.service';
import {HttpClientModule} from '@angular/common/http';

import {LoadingServiceService} from '../services/loading-service.service';
import { StorageService } from '../services/storage/storage.service';

const routes: Routes = [
    {
        path: '',
        component: LoginformPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ], 
    providers: [
        AuthentificationService,
        LoadingServiceService,
        StorageService,
    ],
    declarations: [LoginformPage]
})
export class LoginformPageModule {
}
