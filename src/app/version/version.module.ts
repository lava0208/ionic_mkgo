import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {VersionPage} from './version.page';
import { AppVersion } from '@ionic-native/app-version/ngx';


const routes: Routes = [
    {
        path: '',
        component: VersionPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [VersionPage], providers: [AppVersion]
})
export class VersionPageModule {
}
