import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable()
export class Functions {
    loader: any;
    constructor(private alert: AlertController, private loadingController: LoadingController) {}
    async showAlert(title, text) {
        let alert = await this.alert.create({
            header: title,
            message: text,
            buttons: ['OK']
        });
        alert.present();
    }
    async presentLoading() {
        this.loader = await this.loadingController.create({
            message: "please wait..",
            duration: 3000
        })
        this.loader.present();
    }
    dismissLoading() {
        this.loader.dismiss();
    }
}