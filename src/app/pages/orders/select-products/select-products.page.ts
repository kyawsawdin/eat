import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ActionSheetController, ModalController, IonRouterOutlet, IonContent, IonSlides } from '@ionic/angular';
import { Values } from './../../../values';
import { Service } from './../../../api.service';
import { TranslateService } from '@ngx-translate/core';
import { SelectVariationsPage } from './../select-variations/select-variations.page';
import { SelectGroupedPage } from './../select-grouped/select-grouped.page';
import { FilterPage } from './../../filter/filter.page';

@Component({
  selector: 'app-select-products',
  templateUrl: './select-products.page.html',
  styleUrls: ['./select-products.page.scss'],
})
export class SelectProductsPage implements OnInit {
    @ViewChild(IonContent, {static: false}) content: IonContent;
    @ViewChild('mySlider', {static: false})  slides: IonSlides;
    slideOpts = {
      slidesPerView: 'auto',
      spaceBetween: 5,
      //centeredSlides: true,
    };

    gridView: boolean = false;
  	products: any = [];
    filter: any = { min_price: 0, page: 1, per_page: 40, status: 'publish' };
    has_more_items: boolean = true;
    page: number = 1;
    status: any;
    shouldShowCancel: boolean = true;
    sort: number = 0;
    disabledelete: boolean = true;
    lan: any = {};
    category: any = {};
    vendor: any = {};
    attributes: any;
    id: any;
    subCategories: any = [];
    loading: boolean = true;
    constructor(private route: ActivatedRoute, public modalCtrl: ModalController, public translate: TranslateService, public navCtrl: NavController, public service: Service, public values: Values, public actionSheetCtrl: ActionSheetController, public routerOutlet: IonRouterOutlet) {     
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
          if (params && params.category) {
            this.category = JSON.parse(params.category);   
            this.filter.id = this.category.id; 
            this.getProducts(this.filter.id);   
          } else if(params && params.vendor) {
            this.vendor = JSON.parse(params.vendor); 
            this.filter.id = 0;  
            this.filter.vendor = this.vendor.id; 
            this.getProducts(0);   
          }
          this.getAttributes();
        });  
    }
    ionViewDidEnter() {
        this.subCategories = this.values.categories.filter((item) => item.parent === this.category.id)
    }
    doRefresh(event) {
        this.filter.page = 1;
        this.has_more_items = true;
        this.service.postItem('products', this.filter).then((results) => {
            event.target.complete();
            this.products[this.filter.id] = results;
        });
    }
    getProducts(id) {
        this.service.postItem('products', this.filter).then((results) => {
            this.products[id] = [];
            this.products[id] = results;
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
            this.products[this.filter.id].push.apply(this.products[this.filter.id], results);
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
            this.products[this.filter.id] = results;
        });
    }
    onCancel($event) {
        console.log('cancelled');
    }
    onChange(ev: any) {
        console.log('Changed', ev);
    }
    handleFilterResults(results) {
        this.products[this.filter.id] = results;
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
    getCart() {
        this.navCtrl.navigateForward('/cart');
    }
    updateProducts(item, index) {
        this.scrollToTop(index);
        this.filter = { id: item.id, page: 1, per_page: 40, status: 'publish' };
        this.has_more_items = true;
        this.getProducts(item.id);
    }
    getContent() {
      return document.querySelector('ion-content');
    }
    scrollToTop(index) {
      this.content.scrollToTop(300);
      console.log(index);
      this.slides.slideTo(index);
    }
}

