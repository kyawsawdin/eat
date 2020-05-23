import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { LoginPage } from './../account/login/login.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Settings } from './../../data/settings';
import { Service } from './../../api.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Values } from './../../values';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    toggle: any;
    constructor(public values: Values, private statusBar: StatusBar, public service: Service, public navCtrl: NavController, public settings: Settings, private callNumber: CallNumber, private emailComposer: EmailComposer, public modalCtrl: ModalController, public routerOutlet: IonRouterOutlet) { }

    ngOnInit() {
      this.toggleDarkTheme();
    }
  	async login() {
        const modal = await this.modalCtrl.create({
            component: LoginPage,
            componentProps: {
            	path: 'tabs/profile',
            },
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl,
        });
        modal.present();
        const { data } = await modal.onWillDismiss();
    }
    email() {
      let email = {
        to: this.settings.settings.support_email,
        subject: '',
        body: '',
        isHtml: true
      }
      // Send a text message using default options
      this.emailComposer.open(email);
    }
    phone() {
      this.callNumber.callNumber(this.settings.settings.whatsapp_number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
    }
    chat() {
      
    }
    wallet() {
        if(this.settings.customer.id != 0) {
          this.navCtrl.navigateForward('/app/tabs/profile/wallet');
        } else {
          this.login();
        }
    }
    address(){

       if(this.settings.customer.id != 0) {
          this.navCtrl.navigateForward('/app/tabs/profile/address');
        } else {
          this.login();
        }

    }
    orders() {
        if(this.settings.customer.id != 0) {
          this.navCtrl.navigateForward('/app/tabs/profile/orders');
        } else {
          this.login();
        }
    }
    logout(){
      this.settings.customer = { id: 0 }
      this.settings.vendor = false;
      this.settings.administrator = false;
      this.settings.wishlist = [];
      this.service.postItem('logout').then(res => {}, err => {
          console.log(err);
      });
    }
    toggleDarkTheme() {
      this.toggle = document.querySelector('#themeToggle2');
      this.toggle.addEventListener('ionChange', (ev) => {
        document.body.classList.toggle('dark', ev.detail.checked);
      
        if(ev.detail.checked) {
          this.statusBar.backgroundColorByHexString('#121212');
          this.statusBar.styleLightContent();
        } else {
          this.statusBar.backgroundColorByHexString('#ffffff');
          this.statusBar.styleDefault();
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        if(prefersDark.matches) {
            //
        }
      
      });
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      prefersDark.addListener((e) => checkToggle(e.matches));
      function loadApp() {
        checkToggle(prefersDark.matches);
      }
      function checkToggle(shouldCheck) {
        this.toggle.checked = shouldCheck;
      }
    }
}
