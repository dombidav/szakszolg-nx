import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { Router, RouteReuseStrategy } from '@angular/router'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { IonicStorageModule } from '@ionic/storage-angular'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core'
import {
    createTranslateLoader,
    DefaultInterceptor,
    RedirectService,
    SharedModule,
    STORAGE_SERVICE,
} from '@szakszolg-nx/shared-module'
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { ToastModule } from 'primeng/toast'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService, MessageService } from 'primeng/api'
import { CommonModule, DatePipe } from '@angular/common'
import { StorageService } from '../shared/services/storage.service'
import { PageService } from '../shared/services/page.service'
import { AlertService } from '../shared/services/alert.service'

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        CommonModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
            defaultLanguage: 'hu',
        }),
        ToastModule,
        ConfirmDialogModule,
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        ConfirmationService,
        { provide: STORAGE_SERVICE, useClass: StorageService },
        StorageService,
        PageService,
        MessageService,
        AlertService,
        RedirectService,
        {
            provide: HTTP_INTERCEPTORS,
            useFactory: (router: Router, storage: StorageService, redirect: RedirectService) =>
                new DefaultInterceptor(storage, router, redirect),
            multi: true,
            deps: [Router, StorageService, RedirectService],
        },
        TranslatePipe,
        DatePipe,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
