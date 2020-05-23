import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from './../../../api.service';
import { Values } from './../../../values';
import { Settings } from './../../../data/settings';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.page.html',
  styleUrls: ['./order-summary.page.scss'],
})
export class OrderSummaryPage implements OnInit {
    id: any;
    order: any;
    filter: any = {};
    path: any = 'home';
    constructor(public values: Values, public service: Service, public navCtrl: NavController, public route: ActivatedRoute, public settings: Settings) {
        this.route.queryParams.subscribe(params => {
            if (params && params.order) {
                this.order = JSON.parse(params.order);
                this.path = params.path;
            }
        });
    }
    async getOrder() {
        await this.service.postFlutterItem('order', this.filter).then(res => {
            this.order = res;
            this.getCustomer();
        }).catch(() => {
            
        });
    }
    ngOnInit() {
        this.filter.id = this.route.snapshot.paramMap.get('id');
        this.getOrder();
    }
    continue () {
        this.navCtrl.navigateRoot('/app/tabs/home');
    }
    getCustomer() {
        this.service.postItem('customer').then((results) => {
            this.settings.customer = results;
        });
    }
}
