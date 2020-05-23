import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { KeysPipeModule } from '../app/pipes/pipe.module';
import { HttpModule } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Printer } from '@ionic-native/printer/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { Config } from './config';
import { Values } from './values';
import { Functions } from './functions';
import { SelectVariationsPage } from './pages/orders/select-variations/select-variations.page';
import { SelectGroupedPage } from './pages/orders/select-grouped/select-grouped.page';
import { EditCustomerPage } from './pages/orders/edit-customer/edit-customer.page';
import { FilterPage } from './pages/filter/filter.page';
import { LoginPage } from './pages/account/login/login.page';
import { RegisterPage } from './pages/account/register/register.page';
import { ForgottenPage } from './pages/account/forgotten/forgotten.page';
import { OrderPage } from './pages/account/order/order.page';
import { ReviewPage } from './pages/review/review.page';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, SelectVariationsPage, EditCustomerPage, FilterPage, LoginPage, RegisterPage, ForgottenPage, OrderPage, ReviewPage, SelectGroupedPage],
  entryComponents: [SelectVariationsPage, EditCustomerPage, FilterPage, LoginPage, RegisterPage, ForgottenPage, OrderPage, ReviewPage, SelectGroupedPage],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    KeysPipeModule,
    IonicModule.forRoot(),
     AppRoutingModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }),
      ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],

  providers: [
    StatusBar,
    SplashScreen,
    DatePipe,
    HTTP,
    CurrencyPipe,
    NativeStorage,
    Printer,
    ImagePicker,
    BarcodeScanner,
    Crop,
    OneSignal,
    FormBuilder,
    FileTransfer,
    Functions,
    Values,
    Config,
    SocialSharing,
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
