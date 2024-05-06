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


import {IonicModule} from '@ionic/angular';

import {AddclientmodalPage} from '../addclientmodal/addclientmodal.page';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [ AddclientmodalPage],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule
    ], entryComponents: [AddclientmodalPage],
    exports: [AddclientmodalPage]
})
export class ShareableModule {
}
