import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {DetailcoursepasseePage} from './detailcoursepassee.page';
import {ShareableModule} from '../shareable/shareable.module';
import {HttpClientModule} from '@angular/common/http';
import {CourseService} from '../services/course.service';
import {CourseClientService} from '../services/course-client.service';
import {ClientService} from '../services/client.service';

import {LOCALE_ID} from '@angular/core';

import {registerLocaleData} from '@angular/common';

import localeFr from '@angular/common/locales/fr';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';

registerLocaleData(localeFr);
const routes: Routes = [
    {
        path: '',
        component: DetailcoursepasseePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ShareableModule,
        IonicModule, HttpClientModule,
        RouterModule.forChild(routes), ReactiveFormsModule
    ], providers: [CourseService, CourseClientService, ClientService, {
        provide: LOCALE_ID,
        useValue: 'fr-CA'
    }],
    declarations: [DetailcoursepasseePage]
})
export class DetailcoursepasseePageModule {
}
