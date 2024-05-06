import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';

import {NavController} from '@ionic/angular';
import {ClientService} from '../services/client.service';
import { StorageService } from '../services/storage/storage.service';


@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
    user:any;

    tabRoutes: any;
    clicked = '';
    root;
    userconnectee;
    typeChauffeur;

    isLoaded = false;

    constructor(
        private route: Router,
        private clientservice: ClientService,
        public navCtrl: NavController,
        private activeroute: ActivatedRoute,
        private storageService: StorageService,

           ) {

    }

    async ngOnInit() {


        //init storage
        await this.storageService.init();
        //init storage
        this.user = JSON.parse(await this.storageService.get('currentClientUser'));
        console.log('currentClientUser', this.user)
        if(this.user && this.user.id)
        {

        }
        else
        {
            this.isLoaded = false;
        }

        this.activeroute.queryParams
            .subscribe(params => {
                    console.log(params);
                    this.typeChauffeur = params.typechauffeur || localStorage.getItem('typeChauffeur');
                    console.log(this.typeChauffeur);
                    if (this.typeChauffeur === 'Eleve') {
                        this.tabRoutes = [{
                            tab: 'home',
                            iconName: 'calendar',
                            label: 'Planning',

                        },
                            {
                                tab: 'reclamation',
                                iconName: 'warning',
                                label: 'Remarque',
                            }, {
                                tab: 'inbox',
                                iconName: 'stats',
                                label: 'Rapport',
                            }, {
                                tab: 'pickup',
                                iconName: 'add-circle',
                                label: 'Ajouter Course',

                            }

                        ];
                    } else {
                        this.tabRoutes = [{
                            tab: 'home',
                            iconName: 'calendar',
                            label: 'Planning',

                        },
                            {
                                tab: 'reclamation',
                                iconName: 'warning',
                                label: 'Remarque',
                            }, {
                                tab: 'inbox',
                                iconName: 'stats',
                                label: 'Rapport',
                            },
                            {
                                tab: 'pickup',
                                iconName: 'add-circle',
                                label: 'Ajouter ',

                            }, {
                                tab: 'panier',
                                iconName: 'paper-plane',
                                label: 'Panier',

                            }

                        ];
                    }
                    console.log(this.tabRoutes);
                }
            );


    }


    showtabLabel(label, root) {
        this.clicked = label;

        if (root === 'home') {
            this.clientservice.getemployeebyId(this.user.employe.split('/')[3]).then((res: any) => {
                console.log(res, 'tabs');
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        image: res.filename,
                        nom: res.nom,
                        prenom: res.prenom,
                        typechauffeur: res['typechauffeur']

                    }
                };
                this.typeChauffeur = res['typechauffeur'];

                this.navCtrl.navigateForward(['/tabs/home'], navigationExtras);
            });
        } else {
            this.navCtrl.navigateForward(['/tabs/' + root]);
        }
    }


    ngOnDestroy() {
        this.typeChauffeur = '';
        console.log(this.typeChauffeur);
    }


}
