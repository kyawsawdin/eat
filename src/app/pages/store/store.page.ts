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

	vendors: any;
	filter: any = {};
	hasMoreItems: boolean = true;
	constructor(public service: Service, public values: Values, public settings: Settings, public navCtrl: NavController) { }

	ngOnInit() {
		this.getVendors();
	}
	async getVendors() {
        await this.service.postItem('vendors', this.filter).then(res => {
            this.vendors = res;
        }, err => {
            console.log(err);
        });
    }
    async loadData(event) {
        this.filter.page = this.filter.page + 1;
        await this.service.postItem('vendors', this.filter).then((res: any) => {
            this.vendors.push.apply(this.vendors, res);
            event.target.complete();
            if (res.length == 0) this.hasMoreItems = false;
            else event.target.complete();
        }, err => {
            event.target.complete();
        });
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
