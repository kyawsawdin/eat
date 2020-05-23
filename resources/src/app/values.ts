import { Injectable } from '@angular/core';

@Injectable()
export class Values {

    currency: any = 'USD';
    priceDecimal: any = 3;
    effect: any = 'ios';
    button: any = { fill: 'clear', color: 'dark' };
    categories: any = [];
    mainCategories: any = [];
    order: any = { line_items : [], billing: {}, shipping: {}, shipping_lines: [{method_id: ''}] };
    shippingMethods: any = [];
    paymentMethods: any = [];
    constructor() {
    }
    addProduct(item) {
        if (this.order.line_items.find(e => e.product_id === item.id)) {
		  	this.order.line_items.find(e => e.product_id === item.id).quantity++;
		} else {
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
}