import { Component, OnInit } from '@angular/core';
import { Settings } from './../../../data/settings';
import { Values } from './../../../values';
import { Service } from './../../../api.service';
import { AlertController, NavController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  amount: any;
  wallet: any = {};
  cart: any = {};
  constructor( public navCtrl: NavController, public loadingController: LoadingController, public settings: Settings, public values: Values, public service: Service, public alertController: AlertController) { }

  ngOnInit() {
    this.getWallet();
  }
  doRefresh(event) {
    this.service.postItem('wallet').then(res => {
        this.wallet = res;
        event.target.complete();
    }, err => {
        console.log(err);
    });
  }
  async getWallet() {
      await this.service.postItem('wallet').then(res => {
          this.wallet = res;
          console.log(res);
      }, err => {
          console.log(err);
      });
  }
  addBanalce() {
    this.navCtrl.navigateForward('/wallet-topup');  
  }
  validateForm() {
      if (this.amount == undefined || this.amount == "") {
          this.presentAlert('Please enter Amount');
          return false
      } else {
          return true
      }
  }
  async presentAlert(alertMessage) {
      const alert = await this.alertController.create({
          header: 'Oops!',
          message: alertMessage,
          buttons: ['OK']
      });
      await alert.present();
  }
}
