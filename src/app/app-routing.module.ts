/**
 * Car Pool starter (https://store.enappd.com/product/blablacar-cloneionic-4-car-pooling-app-starter)
 *
 * Copyright © 2019-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs/tabs.page';
import {AuthGuard} from './guards/auth.guard';
import {AutoLoginGuard} from './guards/auto-login.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login', 
        loadChildren: () => import('./loginform/loginform.module').then(m=>m.LoginformPageModule)
    }
    ,
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'home',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./home/home.module').then(m=>m.HomePageModule)
                    }
                ]
            }, 
            {
                path: 'detailcourse/:id',
                loadChildren: () => import('./detailcourse/detailcourse.module').then(m=>m.DetailcoursePageModule)
            },
            {
                path: 'detailcoursepassee/:id',
                loadChildren: () => import('./detailcoursepassee/detailcoursepassee.module').then(m=>m.DetailcoursepasseePageModule)
            },
            {
                path: 'pickup',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pickup/pickup.module').then(m=>m.PickupPageModule)
                    }
                ]
            },

            {
                path: 'inbox',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./inbox/inbox.module').then(m=>m.InboxPageModule)
                    }
                ]
            },
            {
                path: 'panier',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./listpanier/listpanier.module').then(m=>m.ListpanierPageModule)
                    }
                ]
            }, {
                path: 'version', 
                loadChildren: () => import('./version/version.module').then(m=>m.VersionPageModule)
            },
            {
                path: 'updatecourse/:id',
                loadChildren: () => import('./updatecourse/updatecourse.module').then(m=>m.UpdatecoursePageModule)
            },
            {
                path: 'reclamation',
                loadChildren: () => import('./reclamation/reclamation.module').then(m=>m.ReclamationPageModule)
            },
            {
                path: '',
                redirectTo: '/tabs',
                pathMatch: 'full'
            }
        ],
        canLoad: [AuthGuard]

    },
    {
        path: 'addclientmodal',
        loadChildren: () => import('./addclientmodal/addclientmodal.module').then(m=>m.AddclientmodalPageModule)

    },
    {
        path: 'inscription',
        loadChildren: () => import('./inscription/inscription.module').then(m=>m.InscriptionPageModule)
    },
    {
        path: 'reclamation',
        loadChildren: () => import('./reclamation/reclamation.module').then(m=>m.ReclamationPageModule)
    },
    {
        path: 'modalaffectationpanier',
        loadChildren: () => import('./modalaffectationpanier/modalaffectationpanier.module').then(m=>m.ModalaffectationpanierPageModule)
    }


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
