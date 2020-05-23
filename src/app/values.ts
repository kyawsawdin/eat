import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class Values {

    currency: any = 'USD';
    priceDecimal: any = 3;
    effect: any = 'ios';
    button: any = { fill: 'clear', color: 'danger' };
    categories: any = [];
    mainCategories: any = [];
    order: any = { line_items : [], billing: {}, shipping: {}, shipping_lines: [{method_id: ''}], coupon_lines: [] };
    shippingMethods: any = [];
    paymentMethods: any = [];
    lan: any = {};
    allCoupons: any = [];
    discount: any = 0;
    constructor(public translate: TranslateService, public toastController: ToastController) {
        this.translate.get(['Requested quantity not available']).subscribe(translations => {
          this.lan.lowQuantity = translations['Requested quantity not available'];
        });
    }
    addProduct(item) { 
        if (this.order.line_items.find(e => e.product_id === item.id)) {
            if(item.manage_stock && item.stock_quantity <= this.order.line_items.find(e => e.product_id === item.id).quantity) {
                this.presentToast(this.lan.lowQuantity);
            }
		  	else this.order.line_items.find(e => e.product_id === item.id).quantity++;
		} else {
            if(item.manage_stock && item.stock_status == 'outofstock') {
                this.presentToast(this.lan.lowQuantity);
            }
	    	this.order.line_items.push({ name: item.name, price: item.price, regular_price: item.regular_price, sale_price: item.sale_price, product_id: item.id, quantity: 1, stock_status: item.stock_status, image: item.images[0] });
		}
    }
    removeProduct(item) {
        if (this.order.line_items.find(e => e.product_id === item.id)) {
    		let qty = this.order.line_items.find(e => e.product_id === item.id).quantity;
    		if(qty == 1 || qty == 0) {
    			const index = this.order.line_items.indexOf(this.order.line_items.find(e => e.product_id === item.id));
				if (index > -1) {
				  this.order.line_items.splice(index, 1);
				}
			} else {
				this.order.line_items.find(e => e.product_id === item.id).quantity--;
			}
		}
    }
    getCount(item) {
		if(item.type === 'variable') {
            let count = 0;
            this.order.line_items.filter((variation) => variation.product_id == item.id).forEach((e) => {
                count = count + e.quantity;
            });
            return count;
        } else if(item.type === 'grouped') {
            let count = 0;
            this.order.line_items.filter((product) => item.children.map(a => a.id).includes(product.product_id)).forEach((e) => {
                count = count + e.quantity;
            });
            return count;
        }
        else if (this.order.line_items.find(e => e.product_id === item.id)) {
		  	return this.order.line_items.find(e => e.product_id === item.id).quantity;
		} else return 0;
    }
    getTotalCount() {
    	let total = 0;
    	this.order.line_items.forEach((item) => {
    		total = total + item.quantity;
    	});
    	return total;
    }
    getTotal() {
        let total = 0;
        this.order.line_items.forEach((item) => {
            total = total + (parseFloat(item.price) * item.quantity);
        });
        return total - this.discount;
    }
    getTotalOffDiscount() {
        let total = 0;
        this.order.line_items.forEach((item) => {
            total = total + (parseFloat(item.price) * item.quantity);
        });
        return total;
    }
    hasItemInOrder(item) {
    	if (this.order.line_items.find(e => e.product_id === item.id)) {
		  	return true;
		} else if(item.type === 'grouped') {
            return this.order.line_items.filter((product) => item.children.map(a => a.id).includes(product.product_id)).length;
        } else return false;
    }
    setCustomerDetailsToOrder(customer) {
        this.order.billing = customer.billing;
        this.order.shipping = customer.shipping;
        this.order.customer_id = customer.id;
    }
    async presentToast(message) {
        const toast = await this.toastController.create({
          message: message,
          duration: 2000
        });
        toast.present();
    }
    applyCoupon(code) {
        if(this.order.coupon_lines.find((coupon) => coupon.code == code)) {
            this.presentToast('Coupon ' + code + ' already applied!')
        }
        else if(this.allCoupons.length && this.allCoupons.find((coupon) => coupon.code == code)) {
            const coupon = this.allCoupons.find((coupon) => coupon.code == code);
            if(coupon.date_expires != null && (new Date() > new Date(coupon.date_expires))) {
                this.presentToast('This Coupon has expired.!')
            }
            else if (coupon.minimum_amount * 1 != 0 && this.getTotal() < coupon.minimum_amount * 1) {
                this.presentToast('The minimum spend for this coupon is ' + coupon.minimum_amount)
            }
            else if (coupon.maximum_amount * 1 != 0 && this.getTotal() > coupon.maximum_amount * 1) {
                this.presentToast('The maximum spend for this coupon is ' + coupon.maximum_amount)
            } else {
                let totalDiscount = 0;
                if(coupon.discount_type == 'percent') {
                    totalDiscount = this.discount + (this.getTotal() * (coupon.amount/100));
                } else if (coupon.discount_type == 'fixed_cart') {
                    totalDiscount = coupon.amount * 1;
                }  
                if(totalDiscount < this.getTotal()) {
                    this.discount = totalDiscount;
                    this.order.coupon_lines.push({code: code});
                } else {
                    this.presentToast('Coupon ' + code + ' can not be applied!');
                }
            }
        } else {
            this.presentToast('Coupon ' + code + ' does not exist!');
        }
    }
}