import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {Location} from '@angular/common';
import {AppVersion} from '@ionic-native/app-version/ngx';

@Component({
    selector: 'app-version',
    templateUrl: './version.page.html',
    styleUrls: ['./version.page.scss'],
})
export class VersionPage implements OnInit {
    versionNumber;

    constructor(private location: Location, private appVersion: AppVersion) {
    }

    ngOnInit() {
        this.appVersion.getVersionNumber().then(version => {
            this.versionNumber = version;
        });
    }

    cancel() {
        this.location.back();
    }
}
