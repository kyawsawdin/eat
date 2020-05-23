import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from './../../../api.service';
import { Settings } from './../../../data/settings';
import { EditAddressPage } from '../edit-address/edit-address.page';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

  constructor(public platform: Platform,public service: Service, public settings: Settings, public navCtrl: NavController, public loadingController: LoadingController) { }

  ngOnInit() {
  	this.getCustomer();
  }

    async getCustomer() {
       const loading = await this.loadingController.create({
            message: 'Loading...',
            translucent: true,
            cssClass: 'custom-class custom-loading'
        });
        await loading.present();
           await this.service.postItem('customer').then((results) => {
            this.settings.customer = results;
             loading.dismiss();
        }, err => {
                console.log(err);
                loading.dismiss();
            });
    }
    editAddress() {
        this.navCtrl.navigateForward('/edit-address');
    }



}
