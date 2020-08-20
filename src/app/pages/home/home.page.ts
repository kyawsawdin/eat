import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, NavController, AlertController, ModalController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Config } from './../../config';
import { Values } from './../../values';
import { Settings } from './../../data/settings';
import { Functions } from './../../functions';
import { Service } from './../../api.service';
import { SelectVariationsPage } from './../orders/select-variations/select-variations.page';
import { SelectGroupedPage } from './../orders/select-grouped/select-grouped.page';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { LoginPage } from './../account/login/login.page';
import { LocationPage } from './../location/location.page';
import { LS_USER_COORDS, LS_USER_ADDRESS } from './../shared/common';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    slideOpts = {
      slidesPerView: 1.5,
      //spaceBetween: 10,
      freeMode: true,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }
    };
    screenWidth: any = 300;
	products: any;
    showaddress: boolean = false;
    blocks: any = {};
    filter: any = { min_price: 0, page: 1, status: 'publish' };
    paymentMethods: any = [];
    get_wishlist : any;
    has_more_items: boolean = true;
    loading: any = false;
    constructor(private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, private locationAccuracy: LocationAccuracy,private tc: ToastController, private storage: Storage, private route: ActivatedRoute, public modalCtrl: ModalController, public alertCtrl: AlertController, public datepipe: DatePipe, public currencyPipe: CurrencyPipe, public platform: Platform, public functions: Functions, public nativeStorage: NativeStorage, public navCtrl: NavController, public service: Service, public values: Values, public settings: Settings, public config: Config, public translate: TranslateService, public routerOutlet: IonRouterOutlet, private oneSignal: OneSignal) {
        this.screenWidth = this.platform.width();
	}
    ngOnInit() {    
        this.platform.ready().then(() => {
             //this.getLocationLatLng();
             this.locationAccuracy.canRequest().then((canRequest: boolean) => {
              if(canRequest) {
                // the accuracy option will be ignored by iOS
                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                  () => {
                    this.getLocation();
                    console.log('Request successful')
                },
                  error => {
                    console.log('Error requesting location permissions', error);
                });
              }
            });

            // Set language to user preference
            this.nativeStorage.getItem('settings').then((settings : any) => {
                this.config.lang = settings.lang;
                document.documentElement.setAttribute('dir', settings.dir);
            }, error => {
            });

            this.storage.get('userLocation').then((value : any) => {
                if(value) {
                    this.service.userLocation = value;
                }
                this.getBlocks();
            }, error => {
                this.getBlocks();
            });
        });
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
    getTotalCount() {
        let total = 0;
        this.values.order.line_items.forEach((item) => {
            total = total + item.quantity;
        });
        return total;
    }
    addProduct(item) {
        if(item.type === 'variable') {
            this.selectVariation(item);
        } else if(item.type === 'grouped') {
            this.selectGrouped(item);
        } else this.values.addProduct(item);
    }
    removeProduct(item) {
        if(item.type === 'variable') {
            this.selectVariation(item);
        } else if(item.type === 'grouped') {
            this.selectGrouped(item);
        } else this.values.removeProduct(item);
    }
    async selectVariation(item) {
        const modal = await this.modalCtrl.create({
            component: SelectVariationsPage,
            componentProps: {
                item: item,
                path: 'app/tabs/home'
            },
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl,
        });
        modal.present();
        const { data } = await modal.onWillDismiss();
    }
    async selectGrouped(item) {
        const modal = await this.modalCtrl.create({
            component: SelectGroupedPage,
            componentProps: {
                item: item,
                path: 'app/tabs/home'
            },
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl,
        });
        modal.present();
        const { data } = await modal.onWillDismiss();
    }
    async getLocation(){
        const modal = await this.modalCtrl.create({
            component: LocationPage,
            componentProps: {
                path: 'app/tabs/home'
            },
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl,
        });
        modal.present();
        const { data } = await modal.onWillDismiss();
        if(data && data.update) {
            this.filter.page = 1;
            this.getBlocks();
            this.service.getVendors();
        }
    }
    getBlocks() {
        this.loading = true;
        this.service.postItem('keys').then(res => {
            this.loading = false;
            this.blocks = res;
            if(this.blocks && this.blocks.user)
            this.settings.user = this.blocks.user.data;
            if(this.blocks.settings.location_filter == 1 && this.service.userLocation.latitude == 0) {
                this.blocks.recentProducts = [];
                this.blocks.categories = [];
            }
            //this.settings.theme = this.blocks.theme;
            this.settings.pages = this.blocks.pages;
            if(this.blocks.user)
            this.settings.reward = this.blocks.user.data.points_vlaue;
            if(this.blocks.languages)
            this.settings.languages = Object.keys(this.blocks.languages).map(i => this.blocks.languages[i]);
            this.settings.currencies = this.blocks.currencies;
            this.settings.settings = this.blocks.settings;
            this.settings.dimensions = this.blocks.dimensions;
            this.values.currency = this.blocks.settings.currency;
            //this.values.priceDecimal = this.blocks.settings.priceDecimal;
            
            //*** Delete this if you are going to add multicountry and multistate ***?
            if(this.blocks.settings.defaultCountry) {
                this.values.order.billing.country = this.blocks.settings.defaultCountry;
                this.values.order.shipping.country = this.blocks.settings.defaultCountry;
            }
            if(this.blocks.settings.baseState) {
                this.values.order.billing.state = this.blocks.settings.baseState;
                this.values.order.shipping.state = this.blocks.settings.baseState;
            }


            if(this.blocks.categories){
                this.values.categories = this.blocks.categories.filter(item => item.name != 'Uncategorized');
                this.values.mainCategories = this.values.categories.filter(item => item.parent == 0);
            }
            this.processOnsignal();
            for (let item in this.blocks.blocks) {
                var filter;
                if (this.blocks.blocks[item].block_type == 'flash_sale_block') {
                    this.blocks.blocks[item].interval = setInterval(() => {
                        var countDownDate = new Date(this.blocks.blocks[item].sale_ends).getTime();
                        var now = new Date().getTime();
                        var distance = countDownDate - now;
                        this.blocks.blocks[item].days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        this.blocks.blocks[item].hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        this.blocks.blocks[item].minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        this.blocks.blocks[item].seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        if (distance < 0) {
                            clearInterval(this.blocks.blocks[item].interval);
                            this.blocks.blocks[item].hide = true;
                        }
                    }, 1000);
                }
            }
            if (this.blocks.user) {
                this.service.postItem('get_wishlist').then(res => {
                    this.get_wishlist = res;
                    for (let item in this.get_wishlist ) {
                        this.settings.wishlist[this.get_wishlist [item].id] = this.get_wishlist [item].id;
                    }
                }, err => {
                    console.log(err);
                });
            }

            this.nativeStorage.setItem('blocks', {
                    blocks: this.blocks,
                    categories: this.values.categories
                }).then(
            () => console.log('Stored item!'), error => console.error('Error storing item', error));
                
            /* Product Addons */
            if(this.blocks.settings.switchAddons){
                this.service.getAddonsList('product-add-ons').subscribe(res => {
                    this.settings.addons = res;
                });
            }
            this.getCustomer();
            this.getShippingAndPayment();
        }, err => {
            console.log(err);
        });
    }
    processOnsignal() {
        this.oneSignal.startInit(this.blocks.settings.onesignal_app_id, this.blocks.settings.google_project_id);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
        this.oneSignal.handleNotificationReceived().subscribe(() => {
            //do something when notification is received
        });
        this.oneSignal.handleNotificationOpened().subscribe(result => {
            if (result.notification.payload.additionalData.category) {
                this.navCtrl.navigateForward('/app/tabs/home/products/' + result.notification.payload.additionalData.category);
            } else if (result.notification.payload.additionalData.product) {
                this.navCtrl.navigateForward('/app/tabs/home/product/' + result.notification.payload.additionalData.product);
            } else if (result.notification.payload.additionalData.post) {
                this.navCtrl.navigateForward('/app/tabs/home/post/' + result.notification.payload.additionalData.post);
            } else if (result.notification.payload.additionalData.order) {
                this.navCtrl.navigateForward('/app/tabs/account/orders/order/' + result.notification.payload.additionalData.order);
            }
        });
        this.oneSignal.endInit();
    }
    getCategory(category) {
        let navigationExtras = {
          queryParams: {
            category: JSON.stringify(category)
          }
        };
        this.navCtrl.navigateForward('/select-products/' + category.id, navigationExtras);
    }
    detail(item){
        let navigationExtras = {
          queryParams: {
            product: JSON.stringify(item),
            path: 'home'
          }
        };
        this.navCtrl.navigateForward('/product-detail/' + item.id, navigationExtras);
    }
    goto(item) {
        if (item.description == 'category') {
            let category = {id: item.url, name: item.title ? item.title : ''};
            let navigationExtras = {
              queryParams: {
                category: JSON.stringify(category)
              }
            };
            this.navCtrl.navigateForward('/select-products/' + category.id, navigationExtras);
        };
        //else if (item.description == 'product') this.navCtrl.navigateForward('/app/tabs/home/product/' + item.url);
        //else if (item.description == 'post') this.navCtrl.navigateForward('/app/tabs/home/post/' + item.url);
    }
    getSubCategories(id) {
        const results = this.values.categories.filter(item => item.parent === parseInt(id));
        return results;
    }
    doRefresh(event) {
        this.filter.page = 1;
        this.getBlocks();
        setTimeout(() => {
            event.target.complete();
        }, 2000);
    }
    getShippingAndPayment() {
        this.service.getItem('/shipping/zones/0/methods').then((results) => {
            this.values.shippingMethods = results;
            if(this.values.shippingMethods.length)
            this.values.order.shipping_lines[0].method_id = this.values.shippingMethods[0].method_id;
        });
        this.service.getItem('/payment_gateways').then((results) => {
            this.paymentMethods = results;
            this.values.paymentMethods = this.paymentMethods.filter((item) => item.enabled);
            if(this.values.paymentMethods.length)
            this.values.order.payment_method = this.values.paymentMethods[0].id;
        });
        this.service.getItem('/coupons', { per_page: 100, order: 'desc', orderby: 'id' }).then((results) => {
            this.values.allCoupons = results;
        });
    }
    getCustomer() {
        this.service.postItem('customer').then((results) => {
            this.settings.customer = results;
            this.values.setCustomerDetailsToOrder(this.settings.customer);
            if(this.settings.customer.user_roles) {
                if(this.settings.customer.user_roles.includes('condc_vendor') || this.settings.customer.user_roles.includes('seller') || this.settings.customer.user_roles.includes('wcfm_vendor') ){
                    this.settings.vendor = true;
                } if(this.settings.customer.user_roles.includes('administrator')) {
                    this.settings.administrator = true;
                }
            }
        });
    }
    doInfinite(event) {
        this.filter.page += 1;
        this.service.postItem('products', this.filter).then((results) => this.handleMore(results, event));
    }
    handleMore(results, event) {
        if (results.length != 0) {
            this.blocks.recentProducts.push.apply(this.blocks.recentProducts, results);
        }
        if (results.length == 0) {
            this.has_more_items = false;
        }
        event.target.complete();
    }
    cart() {
        this.navCtrl.navigateForward('/cart');
    }
    async presentToastMsg(title, message) {
    const toast = await this.tc.create({
      header: title,
      message: message,
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }
}
