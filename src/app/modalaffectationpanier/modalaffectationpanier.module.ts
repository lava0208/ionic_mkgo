import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalaffectationpanierPage } from './modalaffectationpanier.page';
import {CourseService} from '../services/course.service';
import {AffectationService} from '../services/affectation.service';

const routes: Routes = [
  {
    path: '',
    component: ModalaffectationpanierPage
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
export class ModalaffectationpanierPageModule {}
