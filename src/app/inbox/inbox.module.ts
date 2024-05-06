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
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {InboxPage} from './inbox.page';
import {ShareableModule} from '../shareable/shareable.module';
import {CourseService} from '../services/course.service';
import {CourseClientService} from '../services/course-client.service';
import {ClientService} from '../services/client.service';
import {HttpClientModule} from '@angular/common/http';
import { DatePicker } from '@ionic-native/date-picker/ngx';

const routes: Routes = [
    {
        path: '',
        component: InboxPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HttpClientModule,
        ShareableModule,
        RouterModule.forChild(routes)
    ], providers: [CourseService, CourseClientService, ClientService],
    declarations: [InboxPage]
})
export class InboxPageModule {
}
