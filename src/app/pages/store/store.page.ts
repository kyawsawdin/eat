import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Values } from './../../values';
import { Settings } from './../../data/settings';
import { Service } from './../../api.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

	filter: any = {};
	constructor(public service: Service, public values: Values, public settings: Settings, public navCtrl: NavController) { }

	ngOnInit() {
		this.service.getVendors();
	}
    detail(vendor) {
        let navigationExtras = {
          queryParams: {
            vendor: JSON.stringify(vendor)
          }
        };
        this.navCtrl.navigateForward('/select-products/' + vendor.id, navigationExtras);
    }
}
