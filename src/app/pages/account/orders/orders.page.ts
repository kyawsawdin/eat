import { Component, OnInit } from '@angular/core';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from './../../../api.service';
import { Values } from './../../../values';
import { Settings } from './../../../data/settings';
import { NavigationExtras } from '@angular/router';
import { OrderPage } from './../order/order.page';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
    filter: any = {};
    orders: any;
    hasMoreItems: boolean = true;
    constructor(public modalCtrl: ModalController, public values: Values, public service: Service, public settings: Settings, public router: Router, public route: ActivatedRoute, public routerOutlet: IonRouterOutlet) {
        this.filter.page = 1;
        this.filter.customer = this.settings.customer.id;
    }
    ngOnInit() {
        this.getOrders();
    }
    async getOrders() {
        await this.service.postFlutterItem('orders', this.filter).then(results => {
            console.log(results)
            this.orders = results;
        }).catch((err) => {
            console.log(err);
        });
    }
    async loadData(event) {
        this.filter.page = this.filter.page + 1;
        await this.service.postFlutterItem('orders', this.filter).then(res => {
            this.orders.push.apply(this.orders, res);
            event.target.complete();
            if (!res) this.hasMoreItems = false;
        }).catch(() => {
            event.target.complete();
        });
    }
    async getDetail(order) {
        const modal = await this.modalCtrl.create({
          component: OrderPage,
          componentProps: {
            'order': order
          },
          swipeToClose: true,
          presentingElement: this.routerOutlet.nativeEl,
        });
        modal.present();
    }
}