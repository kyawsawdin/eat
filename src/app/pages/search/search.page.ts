import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { Values } from './../../values';
import { Service } from './../../api.service';
import { SelectVariationsPage } from './../orders/select-variations/select-variations.page';
import { SelectGroupedPage } from './../orders/select-grouped/select-grouped.page';
import { FilterPage } from './../filter/filter.page';
import { Settings } from './../../data/settings';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  	gridView: boolean = false;
	products: any;
	filter: any = { min_price: 0, page: 1, per_page: 40, status: 'publish' };
	has_more_items: boolean = true;
	page: number = 1;
	loading: boolean = true;
	attributes: any;
	constructor(public settings: Settings, private route: ActivatedRoute, public modalCtrl: ModalController, public navCtrl: NavController, public service: Service, public values: Values, public routerOutlet: IonRouterOutlet) {     
    }
	ngOnInit() {
	}
	doRefresh(event) {
        this.filter.page = 1;
        this.has_more_items = true;
        this.service.postItem('products', this.filter).then((results) => {
            event.target.complete();
            this.products = results;
        });
    }
    getProducts(id) {
        this.service.postItem('products', this.filter).then((results) => {
            this.products = [];
            this.products = results;
            this.loading = false;
        });
    }
    getAttributes() {
        this.service.postItem('product-attributes', {
            category: this.filter.id
        }).then(res => {
            this.attributes = res;
        }, err => {
            console.log(err);
        });
    }
    doInfinite(event) {
        this.filter.page += 1;
        this.service.postItem('products', this.filter).then((results) => this.handleMore(results, event));
    }
    handleMore(results, event) {
        if (results.length != 0) {
            this.products.push.apply(this.products, results);
        }
        if (results.length == 0) {
            this.has_more_items = false;
        }
        event.target.complete();
    }
    onInput($event) {
        this.filter.q = $event.srcElement.value;
        this.filter.page = 1;
        this.service.postItem('products', this.filter).then((results) => {
            this.products = results;
        });
    }
    onCancel($event) {
        console.log('cancelled');
    }
    onChange(ev: any) {
        console.log('Changed', ev);
    }
    handleFilterResults(results) {
        this.products = results;
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
                path: 'select-products/' + item.id
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
                path: 'select-products/' + item.id
            },
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl,
        });
        modal.present();
        const { data } = await modal.onWillDismiss();
    }
    async getFilter() {
        const modal = await this.modalCtrl.create({
            component: FilterPage,
            componentProps: {
                attributes: this.attributes,
                filter: this.filter,
                id: this.filter.id
            },
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl,
        });
        modal.present();
        const { data } = await modal.onWillDismiss();
        if (data) {
            this.filter = data;
            Object.keys(this.filter).forEach(key => this.filter[key] === undefined ? delete this.filter[key] : '');
            this.filter.page = 1;
            this.getProducts(this.filter.id);
        }
    }
    toggleGridView() {
        this.gridView = !this.gridView;
    }
    detail(item){
        let navigationExtras = {
          queryParams: {
            product: JSON.stringify(item),
            path: 'select-products/' + item.id
          }
        };
        this.navCtrl.navigateForward('/product-detail/' + item.id, navigationExtras);
    }
    cart() {
        this.navCtrl.navigateForward('/cart');
    }
}
