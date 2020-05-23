import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { Values } from './../../../values';
import { Settings } from './../../../data/settings';

@Component({
  selector: 'app-select-grouped',
  templateUrl: './select-grouped.page.html',
  styleUrls: ['./select-grouped.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectGroupedPage implements OnInit {
  	gridView: boolean = false;
    product: any = {};
  	filter: any = { page: 1, status: 'publish', per_page: 100 };
    has_more_items: boolean = true;
    path: any = 'home';
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
      this.product.gr = true;
        this.values.addProduct(item);
    }
    removeProduct(item) {
      this.product.gr = true;
        this.values.removeProduct(item);
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
    detail(item) {
      let navigationExtras = {
        queryParams: {
          product: JSON.stringify(item),
          path: 'select-products/' + item.id
        }
      };
      this.navCtrl.navigateForward('/product-detail/' + item.id, navigationExtras);
      this.modalCtrl.dismiss({});
    }
}
