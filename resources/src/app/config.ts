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

        this.url = 'http://localhost:8888/wcfm';
        this.consumerKey = 'ck_3d830df320464aa035db90736aa87853b2520067';
        this.consumerSecret = 'cs_787fcdc4b44418aa9765d901f0534a23ec6b00da';

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