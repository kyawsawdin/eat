import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, ModalController, IonRouterOutlet, LoadingController } from '@ionic/angular';
import { Values } from './../../../values';
import { Settings } from './../../../data/settings';
import { Service } from './../../../api.service';
import { Config } from './../../../config';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

declare var Stripe;
@Component({
  selector: 'app-wallet-topup',
  templateUrl: './wallet-topup.page.html',
  styleUrls: ['./wallet-topup.page.scss'],
})
export class WalletTopupPage implements OnInit {

    stripe: any;
    card: any;
    cardElement: any;
    stripeStatus: any = {};
    paymentForm: any = {};

    disableSubmit: boolean = false;
    placeOrder: boolean = false;
    paymentResults: any = {};
    redirect: any;
    postData: any = {};
    paymentUrl: any;
    loading: any;
    couponCode: any = '';
    order: any = { customer_id: 0, line_items : [{name: '', total: 100, id: 0, quantity: 1}], billing: {}, shipping: {}, shipping_lines: [{method_id: ''}], coupon_lines: [] };
    constructor(public loadingController: LoadingController, public iab: InAppBrowser, public config: Config, public settings: Settings, public modalCtrl: ModalController, public navCtrl: NavController, public service: Service, public values: Values, public actionSheetCtrl: ActionSheetController, public routerOutlet: IonRouterOutlet) {}
    ngOnInit() {
      this.order = { customer_id: 1, line_items : [{name: this.settings.customer.wallet.product.name, total: 100, product_id: this.settings.customer.wallet.product.id, quantity: 1}], billing: {}, shipping: {}, shipping_lines: [], coupon_lines: [] };
      if(this.values.paymentMethods && this.values.paymentMethods.length) {
        const method = this.values.paymentMethods.find((item) => item.id === 'stripe');
        if(method) {
          this.stripe = Stripe(method.settings.test_publishable_key.value);
          if(this.order.payment_method === 'stripe')
          setTimeout(() => {
             this.setupStripe();
          }, 400);
        }
      }
    }
  	addProduct(index) {
  		this.order.line_items[index].quantity++;
    }
    removeProduct(index) {
        let qty = this.order.line_items[index].quantity;
		if(qty == 1 || qty == 0) {
			this.order.line_items.splice(index, 1);
		} else {
			this.order.line_items[index].quantity--;
		}
    }
    save() {
      this.createOrder();
    }
    createOrder(){
      if(this.order.payment_method === 'cod') {
        this.order.status = 'processing';
      } if (this.validateCheckout()) {
        this.presentLoading();
        this.order.payment_method_title = this.values.paymentMethods.find((item) => item.id === this.order.payment_method).title;
        this.order.line_items[0].total = this.order.line_items[0].total.toString();
        this.service.wcpost('/orders', this.order).then((results) => {
          this.order = results;
          this.processPayment();
        }).catch(() => {
          this.placeOrder = false;
          this.stopLoading();
        });
      }
      
    }

    /*** Process Payment ****/
    processPayment() {
      this.redirect = this.config.url + '/checkout/order-pay/' + this.order.id + '/?key=' + this.order.order_key;
      if (this.order.payment_method == 'paypalpro' || this.order.payment_method == 'bacs' || this.order.payment_method == 'cheque' || this.order.payment_method == 'cod' || this.order.payment_method == 'authnet') {
          this.orderSummary();
      } else if (this.order.payment_method == 'wallet') {
          this.walletPay();
      } else if (this.order.payment_method == 'payuindia') {
          this.handlePayUPayment();
      } else if (this.order.payment_method == 'paypal') {
        this.handlePayPalPayment();
      } else if (this.order.payment_method == 'paytm') {
          this.handlePaytmPayment();
      } else if (this.order.payment_method == 'paytm-qr') {
          this.handlePaytmQRPayment();
      } else if(this.order.payment_method == 'braintree_credit_card') {
        this.redirect = this.config.url + '/checkout/order-pay/' + this.order.id + '/?pay_for_order=true&key=' + this.order.order_key;
        this.handlePayment();
      } else this.handlePayment();
    }
    handlePayment() {
        var options = "location=no,hidden=yes,toolbar=no,hidespinner=yes";
        let browser = this.iab.create(this.redirect, '_blank', options);
        browser.show();
        this.stopLoading();
        browser.on('loadstart').subscribe(data => {
            if (data.url.indexOf('/order-received/') != -1  && data.url.indexOf('key=wc_order_') != -1) {
                this.orderSummary();
                browser.hide();
            } else if (data.url.indexOf('cancel_order=true') != -1 || data.url.indexOf('cancelled=1') != -1 || data.url.indexOf('cancelled') != -1) {
                browser.close();
                this.stopLoading();
            }
        });
        browser.on('exit').subscribe(data => {
            this.stopLoading();
        });
    }
    handlePayUPayment() {
        var options = "location=no,hidden=yes,toolbar=no,hidespinner=yes";
        let browser = this.iab.create(this.redirect, '_blank', options); 
        var browserActive = false;
        browser.on('loadstart').subscribe(data => {
            if (data.url.indexOf('payumoney.com/transact') != -1 && !browserActive) {
                browserActive = true;
                browser.show();
                this.stopLoading();
            } 
            else if (data.url.indexOf('/order-received/') != -1 && data.url.indexOf('key=wc_order_') != -1) {
                this.orderSummary();
                browser.hide();
            } else if (data.url.indexOf('cancel_order=true') != -1 || data.url.indexOf('cancelled=1') != -1 || data.url.indexOf('cancelled') != -1) {
                browser.close();
                this.stopLoading();
            }
        });
        browser.on('exit').subscribe(data => {
            this.stopLoading();
        });
    }
    handlePaytmPayment() {
        var browserActive = false;
        var options = "location=no,hidden=yes,toolbar=yes";
        let browser = this.iab.create(this.redirect, '_blank', options);
        browser.on('loadstart').subscribe(data => {
            if (data.url.indexOf('/order-pay/') != -1) {
                browserActive = true;
                browser.show();
                this.stopLoading();
            }
            else if ((data.url.indexOf('securegw-stage.paytm.in/theia') != -1 || data.url.indexOf('processTransaction') != -1) && !browserActive) {
                browserActive = true;
                browser.show();
                this.stopLoading();
            } 
            else if (data.url.indexOf('type=success') != -1) {
                this.orderSummary();
                browser.hide();
            }
            else if (data.url.indexOf('type=error') != -1 || data.url.indexOf('Failed') != -1 || data.url.indexOf('cancel_order=true') != -1 || data.url.indexOf('cancelled') != -1) {
                browser.close();
                this.stopLoading();
            }
            else if (data.url.indexOf('Thank+you+for+your+order') != -1) {
                browser.close();
                this.stopLoading();
            }     
        });
        browser.on('exit').subscribe(data => {
            this.stopLoading();
        });
    }
    handlePaytmQRPayment() {
        var options = "location=no,hidden=yes,toolbar=yes";
        let browser = this.iab.create(this.redirect, '_blank', options);
        browser.on('loadstart').subscribe(data => {
            browser.show();
            this.stopLoading();
            if (data.url.indexOf('/order-received/') == -1) {
                browser.hide();
                this.orderSummary();
                this.stopLoading();
            }     
        });
        browser.on('exit').subscribe(data => {
            this.stopLoading();
        });
    }
    handlePayPalPayment() {
      this.service.postItem('process_payment', {id: this.order.id}).then(res => {
          this.paymentResults = res;
          var pageContent = '<html><head></head><body><form id="loginForm" action="http://130.211.141.170/ionic4/checkout/order-pay/'+ this.order.id +'/?pay_for_order=true&key='+ this.order.order_key +'" method="post">' +
          '<input type="hidden" name="payment_method" value="' + this.order.payment_method + '">' +
          '<input type="hidden" name="woocommerce_pay" value="' + 1 + '">' +
          '<input type="hidden" name="woocommerce-pay-nonce" value="' + this.paymentResults['woocommerce-pay-nonce'] + '">' +
          '<input type="hidden" name="_wp_http_referer" value="' + this.config.url + '/checkout/order-pay/'+ this.order.id +'/?pay_for_order=true&key=' + this.order.order_key + '">' +
          '</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';
          var pageContentUrl = 'data:text/html;base64,' + window.btoa(pageContent);
          var options = "location=no,hidden=no,toolbar=no,hidespinner=yes";
          let browser = this.iab.create(pageContentUrl, '_blank', options);
          browser.show();
          this.stopLoading();
          browser.on('loadstart').subscribe(data => {
              if (data.url.indexOf('/order-received/') != -1  && data.url.indexOf('key=wc_order_') != -1) {
                  browser.hide();
                  this.orderSummary();
              } else if (data.url.indexOf('cancel_order=true') != -1 || data.url.indexOf('cancelled=1') != -1 || data.url.indexOf('cancelled') != -1) {
                  browser.close();
                  this.stopLoading();
              }
          });
          browser.on('exit').subscribe(data => {
              this.stopLoading();
          });
      }, err => {
         
      });
    }
    walletPay() {
      this.service.postItem('process_payment', {id: this.order.id}).then((results) => {
        this.paymentResults = results;
          this.postData = {};
          this.postData.payment_method = this.order.payment_method;
          this.postData.woocommerce_pay = 1;
          this.postData['woocommerce-pay-nonce'] = this.paymentResults['woocommerce-pay-nonce'];
          this.postData._wp_http_referer = this.config.url + '/checkout/order-pay/'+ this.order.id +'/?pay_for_order=true&key=' + this.order.order_key;
            this.service.submitPaymentDetails(this.redirect, this.postData).then((results) => {
              this.getOrder();
            }).catch((err) => {
              this.paymentUrl = err;
              if(this.paymentUrl.includes('order-received')) {
                this.orderSummary();
              } else {
                this.getOrder();
              }
            });
        }).catch(() => {
      });
    }
    getOrder() {
      this.service.getItem('/orders/' + this.order.id, {}).then(res => {
          this.order = res;
          if(this.order.status === 'processing' || this.order.status === 'completed') {
            this.orderSummary();
          } else {
            this.stopLoading();
          }
      }, err => {

      });
    }
    orderSummary() {
      this.stopLoading();
      this.order.line_items = [];
      delete this.order.status;
      let navigationExtras = {
        queryParams: {
          order: JSON.stringify(this.order),
          path: 'home'
        }
      };
      this.navCtrl.navigateForward('/order-summary/' + this.order.id, navigationExtras);
    }

    // FOR STRIPE PAYMENT
    onChangePaymentMethod(){
      if(this.order.payment_method === 'stripe')
      setTimeout(() => {
         this.setupStripe();
      }, 400);
    }
    setupStripe() {
        var style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };
        var elements = this.stripe.elements();
        this.cardElement = elements.create('card', {
            hidePostalCode: true,
            style: style
        });
        this.cardElement.mount('#card-element');
        var form = document.getElementById('payment-form');
        form.addEventListener('submit', event => {
            event.preventDefault();
            var ownerInfo = {
                owner: {
                    name: this.order.shipping.first_name + ' ' + this.order.shipping.last_name,
                    address: {
                        line1: this.order.shipping.address_1,
                        city: this.order.shipping.city,
                        postal_code: this.order.shipping.postcode,
                        country: this.order.shipping.country,
                    },
                    email: this.order.billing.email
                },
            };
            if (!this.order.shipping) {
                this.order.shipping.first_name = this.order.billing.first_name;
                this.order.shipping.last_name = this.order.billing.last_name;
                this.order.shipping.company = this.order.billing.company;
                this.order.shipping.address_1 = this.order.billing.address_1;
                this.order.shipping.address_2 = this.order.billing.address_2;
                this.order.shipping.city = this.order.billing.city;
                this.order.shipping.country = this.order.billing.country;
                this.order.shipping.state = this.order.billing.state;
                this.order.shipping.postcode = this.order.billing.postcode;
            }
            this.stripe.createSource(this.cardElement, ownerInfo).then((result) => {
                if (result.error) {
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    this.postData.stripe_source = result.source.id;
                }
            });
        });
        this.scrollToBottom();
    }
    async onClickStripeSubmit() {
      this.onStripeSubmit();
    }
    async onStripeSubmit() {
            this.presentLoading();
            var ownerInfo = {
                owner: {
                    name: this.order.shipping.first_name + ' ' + this.order.shipping.last_name,
                    address: {
                        line1: this.order.shipping.address_1,
                        city: this.order.shipping.city,
                        postal_code: this.order.shipping.postcode,
                        country: this.order.shipping.country,
                    },
                    email: this.order.billing.email
                },
            };
            if (!this.order.shipping) {
                this.order.shipping.first_name = this.order.billing.first_name;
                this.order.shipping.last_name = this.order.billing.last_name;
                this.order.shipping.company = this.order.billing.company;
                this.order.shipping.address_1 = this.order.billing.address_1;
                this.order.shipping.address_2 = this.order.billing.address_2;
                this.order.shipping.city = this.order.billing.city;
                this.order.shipping.country = this.order.billing.country;
                this.order.shipping.state = this.order.billing.state;
                this.order.shipping.postcode = this.order.billing.postcode;
            }
            this.stripe.createSource(this.cardElement, ownerInfo).then((result) => {
                if (result.error) {
                  this.stopLoading();
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    this.postData.stripe_source = result.source.id;
                    this.stripNewPayment();
                }
            });
    }
    stripNewPayment() {
      this.order.payment_method_title = this.values.paymentMethods.find((item) => item.id === this.order.payment_method).title;
      this.order.line_items[0].total = this.order.line_items[0].total.toString();
      this.service.wcpost('/orders', this.order).then((results) => {
        this.order = results;
        this.redirect = this.config.url + '/checkout/order-pay/' + this.order.id + '/?key=' + this.order.order_key;
        this.submitStripeDetails();
      }).catch(() => {
        this.placeOrder = false;
        this.stopLoading();
      });
    }
    submitStripeDetails() {
      this.service.postItem('process_payment', {id: this.order.id}).then((results) => {
        this.paymentResults = results;
        this.postData.payment_method = this.order.payment_method;
        this.postData.woocommerce_pay = 1;
        this.postData['woocommerce-pay-nonce'] = this.paymentResults['woocommerce-pay-nonce'];
        this.postData._wp_http_referer = this.config.url + '/checkout/order-pay/'+ this.order.id +'/?pay_for_order=true&key=' + this.order.order_key;
            this.service.submitPaymentDetails(this.redirect, this.postData).then((results) => {
              this.paymentUrl = results;
              if(this.paymentUrl.includes('order-received')) {
                this.orderSummary();
              } else if(this.paymentUrl.includes('wc-stripe-confirmation=1')) {
                this.getReturnUrl();
              }
            }).catch((err) => {
              this.paymentUrl = err;
              if(this.paymentUrl.includes('order-received')) {
                this.orderSummary();
              } else if(this.paymentUrl.includes('wc-stripe-confirmation=1')) {
                this.getReturnUrl();
              }
            });
        }).catch(() => {
          this.stopLoading();
      });
    }
    getReturnUrl(){
      this.service.postItem('get_notice', { id: this.order.id }).then((results) => {
        this.paymentResults = results;        
        this.stripe.handleCardPayment(this.paymentResults.client_secret, this.cardElement, {
            payment_method_data: {
                billing_details: {
                    name: this.order.shipping.first_name + ' ' + this.order.shipping.last_name,
                    address: {
                        line1: this.order.shipping.address_1,
                        city: this.order.shipping.city,
                        postal_code: this.order.shipping.postcode,
                        country: 'GB',
                    },
                    email: this.order.billing.email
                }
            }
        }).then((result) => {
            if (result.error) {
                this.stopLoading();
                //this.buttonSubmit = false;
                // Display error.message in your UI.
            } else {
                //this.buttonSubmit = false;
                this.service.ajaxCall('/?wc-ajax=wc_stripe_verify_intent&order=' + this.order.id + '&nonce=' + this.paymentResults.stripe_confirm_pi + '&redirect_to=').then((results) => {
                    this.orderSummary();
                }).catch((err) => {
                    //
                });
            }
        });
      }).catch(() => {
        this.stopLoading();
      });
    }
    async presentLoading() {
      this.disableSubmit = true;
      this.loading = await this.loadingController.create({
        message: 'Please wait...',
        translucent: true,
        backdropDismiss: true
      });
      await this.loading.present();
      const { role, data } = await this.loading.onDidDismiss();
      this.disableSubmit = false;
    }
    stopLoading() {
      this.disableSubmit = false;
      if(this.loading) {
        this.loading.dismiss();
      }
    }
    getContent() {
      return document.querySelector('ion-content');
    }
    scrollToBottom() {
      this.getContent().scrollToBottom(100);
    }
    getDescription() {
      if(this.order.payment_method)
      return this.values.paymentMethods.find((item) => item.id === this.order.payment_method).description;
      else return null;
    }
    validateCheckout() {
      if(!this.order.payment_method) {
        this.values.presentToast('Select a payament method');
        return false;
      } if(this.order.line_items[0].total == 0) {
        this.values.presentToast('Enter a valid amount');
        return false;
      }
      return true;
    }
}



