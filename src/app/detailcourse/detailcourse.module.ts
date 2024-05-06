import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {DetailcoursePage} from './detailcourse.page';
import {ShareableModule} from '../shareable/shareable.module';
import {HttpClientModule} from '@angular/common/http';
import {CourseService} from '../services/course.service';
import {CourseClientService} from '../services/course-client.service';
import {ClientService} from '../services/client.service';

import {UpdatestatusComponent} from '../updatestatus/updatestatus.component';
import {ConfirmcourseterminerComponent} from '../confirmcourseterminer/confirmcourseterminer.component';


import localeFr from '@angular/common/locales/fr';
import {Clipboard} from '@ionic-native/clipboard/ngx';

registerLocaleData(localeFr);


const routes: Routes = [
    {
        path: '',
        component: DetailcoursePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ShareableModule,
        IonicModule, HttpClientModule,
        RouterModule.forChild(routes), ReactiveFormsModule
    ], providers: [CourseService, Clipboard, CourseClientService, ClientService, {
        provide: LOCALE_ID,
        useValue: 'fr-CA'
    }
    ], entryComponents: [UpdatestatusComponent, ConfirmcourseterminerComponent],
    declarations: [DetailcoursePage, UpdatestatusComponent, ConfirmcourseterminerComponent]
})
export class DetailcoursePageModule {
}
