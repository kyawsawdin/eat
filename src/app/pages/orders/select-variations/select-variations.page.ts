import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { Values } from './../../../values';
import { Settings } from './../../../data/settings';

@Component({
  selector: 'app-select-variations',
  templateUrl: './select-variations.page.html',
  styleUrls: ['./select-variations.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectVariationsPage implements OnInit {
  	gridView: boolean = false;
    product: any = {};
  	data: any = {};
  	filter: any = { page: 1, status: 'publish', per_page: 100 };
    has_more_items: boolean = true;
    path: any = '/tabs/home';
  	constructor(public settings: Settings, public values: Values, private route: ActivatedRoute, private router: Router, public navParams: NavParams, public modalCtrl: ModalController, public navCtrl: NavController) { }
  	ngOnInit() {
	    this.product = this.navParams.data.item;
      this.path = this.navParams.data.path;
	  }
    dismiss() {
	    this.modalCtrl.dismiss({});
  	}
  	close() {
	    this.modalCtrl.dismiss({});
  	}
    addProduct(item) {
    	if (this.values.order.line_items.find(e => e.product_id === this.product.id) && this.values.order.line_items.find(e => e.variation_id === item.variation_id)) {
		  	this.values.order.line_items.find(e => e.variation_id === item.variation_id).quantity++;
  		} else {
          item.stock_status = item.is_in_stock ? 'instock' : 'outofstock';
  	    	this.values.order.line_items.push({ name: this.product.name + ' ' + this.getName(item), price: item.display_price, regular_price: item.regular_price, sale_price: item.sale_price, product_id: this.product.id, variation_id: item.variation_id, quantity: 1, stock_status: item.stock_status, image: item.image });
  		}
    }
    removeProduct(item) {
    	if (this.values.order.line_items.find(e => e.product_id === this.product.id) && this.values.order.line_items.find(e => e.variation_id === item.variation_id)) {
      		let qty = this.values.order.line_items.find(e => e.variation_id === item.variation_id).quantity;
      		if(qty == 1 || qty == 0) {
      			const index = this.values.order.line_items.indexOf(this.values.order.line_items.find(e => e.variation_id === item.variation_id));
  				if (index > -1) {
  				  this.values.order.line_items.splice(index, 1);
  				}
  			} else {
  				this.values.order.line_items.find(e => e.variation_id === item.variation_id).quantity--;
  			}
  		}
    }
    getTotalCount() {
    	let total = 0;
    	this.values.order.line_items.forEach((item) => {
    		total = total + item.quantity;
    	});
    	return total;
    }
    hasItemInOrder(item) {
    	if (this.values.order.line_items.find(e => e.variation_id === item.variation_id)) {
  		  	return true;
  		} else return false;
    }
    getCount(item) {
  		if (this.values.order.line_items.find(e => e.variation_id === item.variation_id)) {
  		  	return this.values.order.line_items.find(e => e.variation_id === item.variation_id).quantity;
  		} else return 0;
    }
    getName(item) {
      //TODO Modify to get name for 2 variations
    	let name = '';
    	item.option.forEach(atr => {
    		name = name + atr.value + ' ';
    	});
    	return name.toUpperCase();
    }
    getTitle(item) {
      //TODO Modify to get name for 2 variations
      let name = '<p>';
      item.option.forEach(atr => {
        name = name + '<span class="variation-value">' + atr.value + '</span><span class="padding-left-right"></span>';
      });
      return name + '</p>';
    }
    detail() {
      let navigationExtras = {
        queryParams: {
          product: JSON.stringify(this.product),
          path: 'select-products/' + this.product.id
        }
      };
      this.navCtrl.navigateForward('/product-detail/' + this.product.id, navigationExtras);
      this.modalCtrl.dismiss({});
    }
}
