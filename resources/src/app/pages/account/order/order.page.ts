import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from './../../../api.service';
import { Values } from './../../../values';
import { Settings } from './../../../data/settings';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { NavParams } from '@ionic/angular';

@Component({
    selector: 'app-order',
    templateUrl: './order.page.html',
    styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
    id: any;
    order: any;
    refundKeys: any = {};
    refund: any = {};
    showRefund: boolean = false;
    disableRefundButton: boolean = false;
    refundResponse: any = {};
    lan: any = {};
    constructor(public values: Values, public navParams: NavParams, public modalCtrl: ModalController,public translate: TranslateService, public service: Service, public settings: Settings, public toastController: ToastController, public router: Router, public route: ActivatedRoute) {}
    async refundKey() {
        await this.service.postItem('woo_refund_key').then(res => {
            this.refundKeys = res;
            console.log(this.refundKeys);
        }, err => {
            console.log(err);
        });
    }
    ngOnInit() {
        this.translate.get(['Refund request submitted!', 'Unable to submit the refund request']).subscribe(translations => {
            this.lan.refund = translations['Refund request submitted!'];
            this.lan.unable = translations['Unable to submit the refund request'];
        });
        this.order = this.navParams.data.order;
        this.refundKey();
    }
    showField() {
      this.showRefund = !this.showRefund;
    }
    async requestRefund(){
        this.disableRefundButton = true;
        this.refund.ywcars_form_order_id = this.order.id;
        this.refund.ywcars_form_whole_order = '1';
        this.refund.ywcars_form_product_id = '';

        this.refund.ywcars_form_line_total = this.order.total;
        this.refund.ywcars_form_reason = this.refund.ywcars_form_reason;
        this.refund.action = 'ywcars_submit_request';
        this.refund.security = this.refundKeys.ywcars_submit_request;

        await this.service.postItem('woo_refund_key', this.refund).then(res => {
            this.refundResponse = res;
            this.disableRefundButton = false;
            if(this.refundResponse.success)
            this.presentToast(this.lan.refund);
            else
            this.presentToast(this.lan.unable);
        }, err => {
            console.log(err);
            this.disableRefundButton = false;
        });
    }
    async presentToast(message) {
        const toast = await this.toastController.create({
          message: message,
          duration: 2000
        });
        toast.present();
    }
    close() {
        this.modalCtrl.dismiss();
    }
}