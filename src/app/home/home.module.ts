import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule, Routes} from '@angular/router';

import {HomePage} from './home.page';
import {HttpClientModule} from '@angular/common/http';

import {CourseService} from '../services/course.service';
import {CourseClientService} from '../services/course-client.service';
import {EntrepriseService} from '../services/entreprise.service';

import {ClientService} from '../services/client.service';

import {ShareableModule} from '../shareable/shareable.module';

import {LocalNotifications} from '@ionic-native/local-notifications/ngx';

import {UpdatefromhomeComponent} from '../updatefromhome/updatefromhome.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';


import localeFr from '@angular/common/locales/fr';
import {UpdatestatusfromhomeComponent} from '../updatestatusfromhome/updatestatusfromhome.component';
import {ModalpagePage} from '../modalpage/modalpage.page';
import {DatePicker} from '@ionic-native/date-picker/ngx';
import {Clipboard} from '@ionic-native/clipboard/ngx';


import {LoadingServiceService} from '../services/loading-service.service';
import {ModalaffectationpanierPage} from '../modalaffectationpanier/modalaffectationpanier.page';

registerLocaleData(localeFr);
const routes: Routes = [
    {
        path: '',
        component: HomePage
    }
];

@NgModule({
    imports: [
        ShareableModule,
        CommonModule,
        FormsModule,
         ReactiveFormsModule,
          NgbPaginationModule,
        IonicModule, HttpClientModule,
        RouterModule.forChild(routes)
    ],
    providers: [CourseService, CourseClientService, EntrepriseService, DatePicker, LoadingServiceService, Clipboard, ClientService, DatePipe, LocalNotifications, {
        provide: LOCALE_ID,
        useValue: 'fr-CA'
    }], entryComponents: [UpdatefromhomeComponent, UpdatestatusfromhomeComponent, ModalpagePage],
    declarations: [HomePage, UpdatefromhomeComponent, UpdatestatusfromhomeComponent, ModalpagePage, ModalaffectationpanierPage]
})
export class HomePageModule {
}
