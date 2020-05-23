import { Component, OnInit } from '@angular/core';
import { Values } from './../../values';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

	constructor(public navCtrl: NavController, public values: Values) { }

	ngOnInit() {
	}
	getProducts(category) {
	    let navigationExtras = {
	      queryParams: {
	        category: JSON.stringify(category)
	      }
	    };
	    this.navCtrl.navigateForward('/select-products/' + category.id, navigationExtras);
	}

}
