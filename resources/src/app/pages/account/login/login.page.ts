import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from './../../../api.service';
import { Values } from './../../../values';
import { Settings } from './../../../data/settings';
import { FormBuilder, Validators } from '@angular/forms';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { ForgottenPage } from './../forgotten/forgotten.page';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';
//import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    form: any;
    errors: any;
    status: any = {};
    disableSubmit: boolean = false;
    pushForm: any = {};
    googleStatus: any = {};
    faceBookStatus: any = {};
    googleLogingInn: boolean = false;
    facebookLogingInn: boolean = false;
    phoneLogingInn: boolean = false;
    userInfo: any = {};
    phoneVerificationError: any;
    constructor(public values: Values, public modalCtrl: ModalController, public platform: Platform, private oneSignal: OneSignal, public service: Service, public settings: Settings, public loadingController: LoadingController, public router: Router, public navCtrl: NavController, private fb: FormBuilder/*, private googlePlus: GooglePlus, private facebook: Facebook*/) {
        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
          });
    }
    ngOnInit() {}
    async onSubmit() {
        await this.service.postItem('flutter-login', this.form.value).then(res => {
            this.settings.customer = res;
            this.values.setCustomerDetailsToOrder(this.settings.customer);
            if (this.platform.is('cordova') && this.settings.settings.onesignal_app_id && this.settings.settings.google_project_id){
                this.oneSignal.getIds().then((data: any) => {
                    this.form.onesignal_user_id = data.userId;
                    this.form.onesignal_push_token = data.pushToken;
                    this.service.postItem('update_user_notification', this.form).then(res =>{});
                });
            }
            if(this.settings.customer.user_roles) {
                if(this.settings.customer.user_roles.includes('condc_vendor') || this.settings.customer.user_roles.includes('seller') || this.settings.customer.user_roles.includes('wcfm_vendor') ){
                    this.settings.vendor = true;
                } if(this.settings.customer.user_roles.includes('administrator')) {
                    this.settings.administrator = true;
                }
            }
            this.modalCtrl.dismiss();
            this.disableSubmit = false;
        }, err => {
            this.errors = err.data;
            if(this.errors && this.errors.length) {
                this.errors.forEach((item, index) => {
                    this.errors[index].message = this.errors[index].message.replace('<strong>ERROR<\/strong>:', '');
                    this.errors[index].message = this.errors[index].message.replace('<strong>Error<\/strong>:', '');
                    this.errors[index].message = this.errors[index].message.replace('/a>', '/span>');
                    this.errors[index].message = this.errors[index].message.replace('<a', '<span');
                });
            }
            this.disableSubmit = false;
        });
    }
    forgotton() {
        this.navCtrl.navigateForward('/tabs/account/login/forgotten');
    }
    /*googleLogin(){
        this.googleLogingInn = true;
        this.googlePlus.login({})
        .then(res => {
            this.googleStatus = res;
            this.service.postItem('flutter-google-login', {
                    "access_token": this.googleStatus.userId,
                    "email": this.googleStatus.email,
                    "first_name": this.googleStatus.givenName,
                    "last_name": this.googleStatus.familyName,
                    "display_name": this.googleStatus.displayName,
                    "image": this.googleStatus.imageUrl
                }).then(res => {
                this.settings.customer = res;
                this.values.setCustomerDetailsToOrder(this.settings.customer);
                if (this.platform.is('cordova') && this.settings.settings.onesignal_app_id && this.settings.settings.google_project_id){
                    this.oneSignal.getIds().then((data: any) => {
                        this.form.onesignal_user_id = data.userId;
                        this.form.onesignal_push_token = data.pushToken;
                        this.service.postItem('update_user_notification', this.form).then(res =>{});
                    });
                }
                if(this.settings.customer.user_roles) {
                    if(this.settings.customer.user_roles.includes('condc_vendor') || this.settings.customer.user_roles.includes('seller') || this.settings.customer.user_roles.includes('wcfm_vendor') ){
                        this.settings.vendor = true;
                    } if(this.settings.customer.user_roles.includes('administrator')) {
                        this.settings.administrator = true;
                    }
                }
                this.modalCtrl.dismiss();
                this.googleLogingInn = false;
            }, err => {
                this.googleLogingInn = false;
            });
            this.googleLogingInn = false;
        })
        .catch(err => {
            this.googleStatus = err;
            this.googleLogingInn = false;
        });
    }
    facebookLogin(){
        this.facebookLogingInn = true;
        this.facebook.login(['public_profile', 'email'])
        .then((res: FacebookLoginResponse) => {
            this.faceBookStatus = res;
            this.service.postItem('flutter-facebook-login', {
                    "access_token": this.faceBookStatus.authResponse.accessToken,
                }).then(res => {
                this.settings.customer = res;
                this.values.setCustomerDetailsToOrder(this.settings.customer);
                if (this.platform.is('cordova') && this.settings.settings.onesignal_app_id && this.settings.settings.google_project_id){
                    this.oneSignal.getIds().then((data: any) => {
                        this.form.onesignal_user_id = data.userId;
                        this.form.onesignal_push_token = data.pushToken;
                        this.service.postItem('update_user_notification', this.form).then(res =>{});
                    });
                }
                if(this.settings.customer.user_roles) {
                    if(this.settings.customer.user_roles.includes('condc_vendor') || this.settings.customer.user_roles.includes('seller') || this.settings.customer.user_roles.includes('wcfm_vendor') ){
                        this.settings.vendor = true;
                    } if(this.settings.customer.user_roles.includes('administrator')) {
                        this.settings.administrator = true;
                    }
                }
                this.modalCtrl.dismiss();
                this.facebookLogingInn = false;
            }, err => {
                this.facebookLogingInn = false;
            });
            this.facebookLogingInn = false;
        })
        .catch(e => {
            this.faceBookStatus = e;
            this.facebookLogingInn = false;
        });
    }*/
    loginWithPhone(){
        this.phoneLogingInn = true;
        (<any>window).AccountKitPlugin.loginWithPhoneNumber({
            useAccessToken: true,
            defaultCountryCode: "IN",
            facebookNotificationsEnabled: true,
          }, data => {
          (<any>window).AccountKitPlugin.getAccount(
            info => this.handlePhoneLogin(info),
            err => this.handlePhoneLogin(err));
          });
    }
    handlePhoneLogin(info){
        if(info.phoneNumber) {
            this.service.postItem('flutter-phone_number_login', {
                    "phone": info.phoneNumber,
                }).then(res => {
                this.settings.customer = res;
                this.values.setCustomerDetailsToOrder(this.settings.customer);
                if (this.platform.is('cordova') && this.settings.settings.onesignal_app_id && this.settings.settings.google_project_id){
                    this.oneSignal.getIds().then((data: any) => {
                        this.form.onesignal_user_id = data.userId;
                        this.form.onesignal_push_token = data.pushToken;
                        this.service.postItem('update_user_notification', this.form).then(res =>{});
                    });
                }
                if(this.settings.customer.user_roles) {
                    if(this.settings.customer.user_roles.includes('condc_vendor') || this.settings.customer.user_roles.includes('seller') || this.settings.customer.user_roles.includes('wcfm_vendor') ){
                        this.settings.vendor = true;
                    } if(this.settings.customer.user_roles.includes('administrator')) {
                        this.settings.administrator = true;
                    }
                }
                this.modalCtrl.dismiss();
                this.phoneLogingInn = false;
            }, err => {
                this.phoneLogingInn = false;
            });
        } else this.phoneLogingInn = false;
    }
    handlePhoneLoginError(error){
        this.phoneVerificationError = error;
        this.phoneLogingInn = false;
    }
    close() {
        this.modalCtrl.dismiss();
    }
    async forgotten() {
      const modal = await this.modalCtrl.create({
          component: ForgottenPage,
          componentProps: {},
          swipeToClose: true,
          //presentingElement: this.routerOutlet.nativeEl,
      });
      modal.present();
      const { data } = await modal.onWillDismiss();
  }
}