import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {InscriptionPage} from './inscription.page';
import {DatePicker} from '@ionic-native/date-picker/ngx';

const routes: Routes = [
    {
        path: '',
        component: InscriptionPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    providers: [DatePicker],
    declarations: [InscriptionPage]
})
export class InscriptionPageModule {
}
