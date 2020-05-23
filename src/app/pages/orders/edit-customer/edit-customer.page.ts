import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { Values } from './../../../values';
import { Service } from './../../../api.service';
import { Settings } from './../../../data/settings';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.page.html',
  styleUrls: ['./edit-customer.page.scss'],
})
export class EditCustomerPage implements OnInit {

	billing: any = {};
	shipping: any = {};
	placeOrder: boolean = false;
	constructor(public settings: Settings, public service: Service, public values: Values, private route: ActivatedRoute, private router: Router, public navParams: NavParams, public modalCtrl: ModalController) {
		this.shipping.country = 'IN';
		this.shipping.state = 'KA';
	}
	ngOnInit() {
		this.billing = this.navParams.data.billing;
		this.shipping = this.navParams.data.shipping;
		this.placeOrder = this.navParams.data.placeOrder;
	}
    dismiss() {
	    this.modalCtrl.dismiss({
	      'billing': this.billing,
	      'shipping': this.shipping,
	      'placeOrder': false
	    });
  	}
  	close() {
	    this.modalCtrl.dismiss({
	      'billing': this.billing,
	      'shipping': this.shipping,
	      'placeOrder': false
	    });
  	}
  	ok() {
	    this.modalCtrl.dismiss({
	      'billing': this.billing,
	      'shipping': this.shipping,
	      'placeOrder': this.placeOrder
	    });
  	}

}
