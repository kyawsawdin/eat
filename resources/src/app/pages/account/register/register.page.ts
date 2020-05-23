import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, Platform, ModalController } from '@ionic/angular';
import { Service } from './../../../api.service';
import { Values } from './../../../values';
import { Settings } from './../../../data/settings';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    form: any;
    errors: any;
    status: any = {};
    disableSubmit: boolean = false;
    pushForm: any;
    phoneLogingInn: boolean = false;
    userInfo: any;
    phoneVerificationError: any;
    constructor(public values: Values, public modalCtrl: ModalController, public platform: Platform, private oneSignal: OneSignal, public service: Service, public loadingController: LoadingController, public settings: Settings, public navCtrl: NavController, private fb: FormBuilder) {
        this.form = this.fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            password: ['', Validators.required],
            email: ['', Validators.email],
            phone: ['', Validators.required],
            address_1: [''],
            address_2: [''],
            city: [''],
            postcode: [''],
          });
    }
    ngOnInit() {}
    async onSubmit() {
        this.disableSubmit = true;
        await this.service.postItem('flutter-create-user', this.form.value).then(res => {
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
            this.disableSubmit = false;
        });
    }
    loginWithPhone(){
        this.phoneLogingInn = true;
        (<any>window).AccountKitPlugin.loginWithPhoneNumber({
            useAccessToken: true,
            defaultCountryCode: "ID",
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
}