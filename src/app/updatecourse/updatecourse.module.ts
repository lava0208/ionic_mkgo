import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {UpdatecoursePage} from './updatecourse.page';
import {CourseService} from '../services/course.service';
import {CourseClientService} from '../services/course-client.service';
import {ClientService} from '../services/client.service';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import {DatePicker} from '@ionic-native/date-picker/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {EntrepriseService} from '../services/entreprise.service';
import {ShareableModule} from '../shareable/shareable.module';
import {HttpClientModule} from '@angular/common/http';

import {Geolocation} from '@ionic-native/geolocation/ngx';

import {Camera} from '@ionic-native/camera/ngx';

import {IonicSelectableModule} from 'ionic-selectable';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {LaunchNavigator} from '@awesome-cordova-plugins/launch-navigator/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';


const routes: Routes = [
    {
        path: '',
        component: UpdatecoursePage
    }
];

@NgModule({
    imports: [
        CommonModule, ShareableModule, HttpClientModule,
        FormsModule, ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes), IonicSelectableModule
    ], providers: [CourseService, Geolocation, AndroidPermissions, LocationAccuracy,
        Camera, LaunchNavigator, DatePicker, Clipboard, Keyboard, DatePicker, CourseClientService, EntrepriseService, ClientService
    ],
    declarations: [UpdatecoursePage]
})
export class UpdatecoursePageModule {
}
