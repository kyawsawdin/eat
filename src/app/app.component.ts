import { Component, OnInit } from '@angular/core';
import { NavController, Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Config } from './config';
import { Service } from './api.service';
import { Values } from './values';
import { Settings } from './data/settings';
import { LoginPage } from './pages/account/login/login.page';
import { RegisterPage } from './pages/account/register/register.page';
//import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  selected: any;
  toggle: any;
  showDarkThemeToggle: boolean = true;
  public appPages = [
    {
      title: 'Home',
      url: '/app/tabs/home',
      icon: 'home'
    },
  ];
  constructor(private platform: Platform, public settings: Settings, private splashScreen: SplashScreen, private statusBar: StatusBar, public config: Config, public navCtrl: NavController, public service: Service, public values: Values, public modalCtrl: ModalController ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  toggleDarkTheme() {
      this.toggle = document.querySelector('#themeToggle');
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
  getWishlist () {
    this.navCtrl.navigateForward('/wishlist');
  }
  getWallet() {
    this.navCtrl.navigateForward('/wallet');
  }
  getOrder () {
    this.navCtrl.navigateForward('/orders');
  }
  getLanguages() {
     this.navCtrl.navigateForward('/language');
  }
  getPoints(){
    this.navCtrl.navigateForward('/points');
  }
  ngOnInit() {
    this.toggleDarkTheme();
    /*const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }*/
  }
  getProducts(category) {
    let navigationExtras = {
      queryParams: {
        category: JSON.stringify(category)
      }
    };
    this.navCtrl.navigateForward('/select-products/' + category.id, navigationExtras);
  }
  async login() {
      const modal = await this.modalCtrl.create({
          component: LoginPage,
          componentProps: {},
          swipeToClose: true,
          //presentingElement: this.routerOutlet.nativeEl,
      });
      modal.present();
      const { data } = await modal.onWillDismiss();
      if (data) {
          //
      }
  }
  async register() {
      const modal = await this.modalCtrl.create({
          component: RegisterPage,
          componentProps: {},
          swipeToClose: true,
          //presentingElement: this.routerOutlet.nativeEl,
      });
      modal.present();
      const { data } = await modal.onWillDismiss();
      if (data) {
          //
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
}
