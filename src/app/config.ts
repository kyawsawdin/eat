import { Injectable } from '@angular/core';
import { URLSearchParams, Headers } from '@angular/http';
//import { NativeStorage } from '@ionic-native/native-storage';

declare var oauthSignature: any;
var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');

@Injectable()
export class Config {
    
    url: any;
    consumerKey: any;
    consumerSecret: any;
    lang: any = 'en';
    oauth: any;
    signedUrl: any;
    randomString: any;
    oauth_nonce: any;
    oauth_signature_method: any;
    encodedSignature: any;
    searchParams: any;
    customer_id: any;
    params: any;
    settings: any = {};
    options: any = {};
    constructor() {

        /*this.url = 'https://testing.fugu.ec/tienda';
        this.consumerKey = 'ck_d75b3779847e2e422e2a632c96b548b2ce334bc1';
        this.consumerSecret = 'cs_cf6d2859507d93f98ae7baa8a0fa18f94895eb60';

        this.url = 'https://ghost.delivery';
        this.consumerKey = 'ck_0484fed992809ee45afc47f1b5e0521d6f33caef';
        this.consumerSecret = 'cs_ce2fa18b044a29849a79936f908807211bac58ae';

        this.url = 'http://35.226.27.186/woogrocery';
        this.consumerKey = 'ck_e00a94b5f205874348991e06cf6414ff55cfbf33';
        this.consumerSecret = 'cs_615eac5a998d3fb4b914bd66f80cf4c46777731d';

        this.url = 'http://130.211.141.170/ionic4';
        this.consumerKey = 'ck_caac3da0f46b7f7a58b9d258f6d296930f35a58b';
        this.consumerSecret = 'cs_05f344b0acb2613526295c093ae5be6c5b6fa2b5';

        this.url = 'http://localhost:8888/wcfm';
        this.consumerKey = 'ck_4a73578d64d0d3f996d69603590c9754b5aab15b';
        this.consumerSecret = 'cs_d8486ede4990b0edbb6d850d3845b2b0e26d1410';

        this.url = 'https://minialwa.com';
        this.consumerKey = 'ck_f298c49c34e84dda649a7f05f2fe55e300735cc4';
        this.consumerSecret = 'cs_3e608921a7369cd49dcaf2b5c1bace9db0225308';

        this.url = 'http://35.226.27.186/wp-dokan';
        this.consumerKey = 'ck_192abc86737595ec345b99a0a2f82e53d43ad160';
        this.consumerSecret = 'cs_dc14ed7864853cfd56887ee7fac45c31b150f843';

        this.url = 'http://35.226.27.186/woogrocery';
        this.consumerKey = 'ck_e00a94b5f205874348991e06cf6414ff55cfbf33';
        this.consumerSecret = 'cs_615eac5a998d3fb4b914bd66f80cf4c46777731d';

        this.url = 'https://dadosh.com';
        this.consumerKey = 'ck_29d2b1801b13b9be0d2a05e68d3634792162c474';
        this.consumerSecret = 'cs_c12c5406cc9ab3211499a4fa3af748f0d8d4831c';*/

        this.url = 'http://35.226.27.186/wp-wcmp';
        this.consumerKey = 'ck_50aed9f8a932095411ee18a8d98ea29e855287a5';
        this.consumerSecret = 'cs_0265cc9f32dc9ce583f94da243e577f0c6fbe281';

        this.options.withCredentials = true;
        this.options.headers = headers;
        this.oauth = oauthSignature;
        this.oauth_signature_method = 'HMAC-SHA1';
        this.searchParams = new URLSearchParams();
        this.params = {};
        this.params.oauth_signature_method = 'HMAC-SHA1';
        this.params.oauth_version = '1.0';
    }
    setOauthNonce(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }
    setUrl(method, endpoint, filter) {
        var key;
        var unordered = {};
        var ordered = {};
        if (this.url.indexOf('https') >= 0) {
            unordered = {};
            if (filter) {
                for (key in filter) {
                    unordered[key] = filter[key];
                }
            }
            unordered['consumer_key'] = this.consumerKey;
            unordered['consumer_secret'] = this.consumerSecret;
            Object.keys(unordered).sort().forEach(function(key) {
                ordered[key] = unordered[key];
            });
            this.searchParams = new URLSearchParams();
            for (key in ordered) {
                this.searchParams.set(key, ordered[key]);
            }
            return this.url + '/wp-json/wc/v3' + endpoint + this.searchParams.toString();
        } else {
            var url = this.url + '/wp-json/wc/v3' + endpoint;
            this.params['oauth_consumer_key'] = this.consumerKey;
            this.params['oauth_nonce'] = this.setOauthNonce(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            this.params['oauth_timestamp'] = new Date().getTime() / 1000;
            for (key in this.params) {
                unordered[key] = this.params[key];
            }
            if (filter) {
                for (key in filter) {
                    unordered[key] = filter[key];
                }
            }
            Object.keys(unordered).sort().forEach(function(key) {
                ordered[key] = unordered[key];
            });
            this.searchParams = new URLSearchParams();
            for (key in ordered) {
                this.searchParams.set(key, ordered[key]);
            }
            this.encodedSignature = this.oauth.generate(method, url, this.searchParams.toString(), this.consumerSecret);
            return this.url + '/wp-json/wc/v3' + endpoint + this.searchParams.toString() + '&oauth_signature=' + this.encodedSignature;
        }
    }
}