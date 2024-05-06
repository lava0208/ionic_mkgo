import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ModalpagePage} from './modalpage.page';
import {CourseService} from '../services/course.service';
import {AffectationService} from '../services/affectation.service';

const routes: Routes = [
    {
        path: '',
        component: ModalpagePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [], providers: [CourseService, AffectationService]
})
export class ModalpagePageModule {
}
