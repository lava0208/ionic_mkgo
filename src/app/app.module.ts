import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {TabsPageModule} from './tabs/tabs.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Geolocation} from '@ionic-native/geolocation/ngx';

import {Camera} from '@ionic-native/camera/ngx';
import {IonicStorageModule} from '@ionic/storage-angular';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {CourseService} from './services/course.service';

import {Vibration} from '@ionic-native/vibration/ngx';

import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {LaunchNavigator} from '@awesome-cordova-plugins/launch-navigator/ngx';
import { HttpConfigInterceptor } from './interceptor/httpConfig.interceptor';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        AppRoutingModule,
        TabsPageModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
    ],
    providers: [
        StatusBar,
        Keyboard,
        Vibration,
        BackgroundMode,
        //Events,
        CourseService,
        SplashScreen,
        Geolocation,
        AndroidPermissions,
        LocationAccuracy,
        Camera,
        LaunchNavigator,
        LocalNotifications,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpConfigInterceptor,
            multi: true
          },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
