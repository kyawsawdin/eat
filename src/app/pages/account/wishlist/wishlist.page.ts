import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from './../../../api.service';
import { Values } from './../../../values';
import { Settings } from './../../../data/settings';
import { SelectVariationsPage } from './../../orders/select-variations/select-variations.page';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.page.html',
    styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
    gridView: boolean = false;
    products: any;
    filter: any = { page: 1, per_page: 100 }
    constructor(public settings: Settings, public navCtrl: NavController, public service: Service, public values: Values, public router: Router, public route: ActivatedRoute, public modalCtrl: ModalController, public routerOutlet: IonRouterOutlet) {}
    ngOnInit() {
    }
    ionViewDidEnter() {
        this.getWishlist();
    }
    async getWishlist() {
        await this.service.postItem('get_wishlist', this.filter).then(res => {
            this.products = res;
        }, err => {
            console.log(err);
        });
    }
    doRefresh(event) {
        this.service.postItem('get_wishlist', this.filter).then((results) => {
            event.target.complete();
            this.products = results;
        });
    }
    async removeFromWishlist(id) {
        await this.service.postItem('remove_wishlist', {
            product_id: id
        }).then(res => {
            this.products = res;
        }, err => {
            console.log(err);
        });
    }
    getProduct(product){
        //TOTO OPEN DETAIL PAGE
        //this.navCtrl.navigateForward('/app/tabs/account/wishlist/product/');
    }
    addProduct(item) {
        if(item.type === 'variable') {
            this.selectVariation(item);
        } else this.values.addProduct(item);
    }
    removeProduct(item) {
        if(item.type === 'variable') {
            this.selectVariation(item);
        }
        else this.values.removeProduct(item);
    }
    async selectVariation(item) {
        const modal = await this.modalCtrl.create({
            component: SelectVariationsPage,
            componentProps: {
                item: item,
            },
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl,
        });
        modal.present();
        const { data } = await modal.onWillDismiss();
    }
    detail(item){
        let navigationExtras = {
          queryParams: {
            product: JSON.stringify(item),
            path: 'wishlist'
          }
        };
        this.navCtrl.navigateForward('/product-detail/' + item.id, navigationExtras);
    }
    getCart() {
        this.navCtrl.navigateForward('/cart');
    }
}