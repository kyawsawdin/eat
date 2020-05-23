import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Config } from './config';
import { HTTP } from '@ionic-native/http/ngx';
import { Headers } from '@angular/http';
import { Platform, AlertController } from '@ionic/angular';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');

@Injectable({
  providedIn: 'root'
})
export class Service {

  options: any = {};
  constructor(public alertController: AlertController, public platform: Platform, private http: HttpClient, private config: Config, private ionicHttp: HTTP) {
  	this.options.withCredentials = true;
    this.options.headers = headers;
  }

	private handleError<T> (operation = 'operation', result?: T) {
	  return (error: any): Observable<T> => {
	    // TODO: send the error to remote logging infrastructure
	    console.error(error); // log to console instead
	    // Let the app keep running by returning an empty result.
	    return of(result as T);
	  };
	}

	getItem(endPoint, filter = {}) {
		const url = this.config.setUrl('GET', endPoint + '?', filter);
		if (this.platform.is('hybrid')) {
			return new Promise((resolve, reject) => {
	            this.ionicHttp.get(url, {}, {})
				  .then(data => {
	            	resolve(JSON.parse(data.data));
				  })
				  .catch(error => {
				  	this.presentAlert(JSON.parse(error.error));
				    reject(JSON.parse(error.error));
			  	});
	        });
		} else {
			return new Promise((resolve, reject) => {
	            this.http.get(url).pipe(map((res: any) => res)).subscribe(data => {
	                resolve(data);
	            }, err => {
	            	this.presentAlert(err.error);
	            	reject(err.error);
	            });
	        });
		}
	}

	deleteItem(endPoint, params = {}){
		const url = this.config.setUrl('DELETE', endPoint + '?', params);
		if (this.platform.is('hybrid')) {
			return new Promise((resolve, reject) => {
	            this.ionicHttp.delete(url, {}, {})
				  .then(data => {
	            	resolve(JSON.parse(data.data));
				  })
				  .catch(error => {
				  	this.presentAlert(JSON.parse(error.error));
				    reject(JSON.parse(error.error));
			  	});
	        });
		} else {
			return new Promise((resolve, reject) => {
	            this.http.delete(url).pipe(map((res: any) => res)).subscribe(data => {
	                resolve(data);
	            }, err => {
	            	this.presentAlert(err.error);
	            	reject(err.error);
	            });
	        });
		}
	}

	putItem(endPoint, data, params = {}){
		const url = this.config.setUrl('PUT', endPoint + '?', params);
		if (this.platform.is('hybrid')) {
			this.ionicHttp.setHeader(this.options, 'Content-Type', 'application/json; charset=UTF-8');
			this.ionicHttp.setDataSerializer('json');
			return new Promise((resolve, reject) => {
	            this.ionicHttp.put(url, data, {})
				  .then(data => {
	            	resolve(JSON.parse(data.data));
				  })
				  .catch(error => {
				  	this.presentAlert(JSON.parse(error.error));
				    reject(JSON.parse(error.error));
			  	});
	        });
		} else {
			return new Promise((resolve, reject) => {
	            this.http.put(url, data).pipe(map((res: any) => res)).subscribe(data => {
	                resolve(data);
	            }, err => {
	            	this.presentAlert(err.error);
	            	reject(err.error);
	            });
	        });
		}
	}

	wcpost(endPoint, data, params = {}){
		const url = this.config.setUrl('POST', endPoint + '?', params);
		if (this.platform.is('hybrid')) {
			this.ionicHttp.setHeader(this.options, 'Content-Type', 'application/json; charset=UTF-8');
			this.ionicHttp.setDataSerializer('json');
			return new Promise((resolve, reject) => {
	            this.ionicHttp.post(url, data, {})
				  .then(data => {
	            	resolve(JSON.parse(data.data));
				  })
				  .catch(error => {
				  	this.presentAlert(JSON.parse(error.error));
				  	reject(JSON.parse(error.error));
			  	});
	        });
		} else {
			return new Promise((resolve, reject) => {
	            this.http.post(url, data).pipe(map((res: any) => res)).subscribe(data => {
	                resolve(data);
	            }, err => {
	            	this.presentAlert(err.error);
	            	reject(err.error);
	            });
	        });
		}
	}

	postItem(endPoint, data = {}){
		var params = new HttpParams();
		for (var key in data) { if('object' !== typeof(data[key])) params = params.set(key, data[key]) }
		params = params.set('lang', this.config.lang);
		const url = this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-' + endPoint;
		return new Promise((resolve, reject) => {
            this.http.post(url, params, this.config.options).pipe(map((res: any) => res)).subscribe(data => {
                resolve(data);
            }, err => {
            	reject(err.error);
            });
        });
	}

	postFlutterItem(endPoint, data = {}){
		var params = new HttpParams();
		for (var key in data) { if('object' !== typeof(data[key])) params = params.set(key, data[key]) }
		params = params.set('lang', this.config.lang);
		const url = this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-' + endPoint;
		return new Promise((resolve, reject) => {
            this.http.post(url, params, this.config.options).pipe(map((res: any) => res)).subscribe(data => {
                resolve(data);
            }, err => {
            	reject(err.error);
            });
        });
	}

	updateOrderReview(endPoint, data = {}){
		delete data['terms_content'];
		delete data['logout_url'];
		delete data['terms'];
		delete data['terms_url'];
		var params = new HttpParams();
		for (var key in data) { if('object' !== typeof(data[key])) params = params.set(key, data[key]) }
		params = params.set('lang', this.config.lang);
		params = params.set('post_data', params.toString());
		const url = this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-' + endPoint;
		return this.http.post(url, params, this.config.options).pipe(
		    tap(_ => {}),
		    catchError(this.handleError(endPoint))
		);
	}

	getBlocks() {
	  const url = `${this.config.url}/wp-admin/admin-ajax.php?action=mstoreapp-keys`;
	  return this.http.get(url, this.config.options).pipe(
	    tap(_ => {}),
	    catchError(this.handleError(`getBlocks`))
	  );
	}

	updateCart(endPoint, params){
		const url = this.config.url + endPoint;
		params = params.set('lang', this.config.lang);
		return this.http.post(url, params, this.config.options).pipe(
		    tap(_ => {}),
		    catchError(this.handleError(endPoint))
		);
	}

	ajaxCall(endPoint, data = {}){
		var params = new HttpParams();
		for (var key in data) { if('object' !== typeof(data[key])) params = params.set(key, data[key]) }
		const url = this.config.url + endPoint;
		return new Promise((resolve, reject) => {
            this.http.post(url, params, this.config.options).pipe(map((res: any) => res)).subscribe(data => {
                resolve(data);
            }, err => {
            	reject(err.error);
            });
        });
	}

	getPosts(endPoint){
		return this.http.get(this.config.url + endPoint).pipe(
		    tap(_ => {}),
		    catchError(this.handleError(endPoint))
		);
	}

	WCMPVendor(endPoint, params = {}){
		const url = this.config.setUrl('GET', '/wp-json/wcmp/v1/' + endPoint + '?', params);
		return this.http.get(url).pipe(
		    tap(_ => {}),
		    catchError(this.handleError(endPoint))
		);
	}

	getReviews(endPoint, filter = {}){
		const url = this.config.setUrl('GET', '/wp-json/wc/v2/' + endPoint + '?', filter);
		return this.http.get(url).pipe(
		    tap(_ => {}),
		    catchError(this.handleError(endPoint))
		);
	}

	getExternalData(url, data = {}){
		var params = new HttpParams();
		for (var key in data) { if('object' !== typeof(data[key])) params = params.set(key, data[key]) }
		return new Promise((resolve, reject) => {
            this.http.post(url, params, this.config.options).subscribe(data => {
                resolve(true);
            }, err => {
            	reject(false);
            });
        });
	}
	submitPaymentDetails(url, data = {}){
		var params = new HttpParams();
		for (var key in data) { if('object' !== typeof(data[key])) params = params.set(key, data[key]) }
		return new Promise((resolve, reject) => {
            this.http.post(url, params, this.config.options).subscribe(res => {
                resolve(true);
            }, err => {
            	reject(err.url);
            });
        });
	}

	getAddonsList(endPoint, filter = {}){
		const url = this.config.setUrl('GET', '/wp-json/wc-product-add-ons/v1/' + endPoint + '?', filter);
		return this.http.get(url).pipe(
		    tap(_ => {}),
		    catchError(this.handleError(endPoint))
		);
	}

	getWCFM(endPoint, params = {}){
		const url = this.config.setUrl('GET', '/wp-json/wcfmmp/v1/' + endPoint + '?', params);
		return this.http.get(url).pipe(
		    tap(_ => {}),
		    catchError(this.handleError(endPoint))
		);
	}

	getWCFMIonic(endPoint, params = {}){
		const url = this.config.setUrl('GET', '/wp-json/wcfmmp/v1/' + endPoint + '?', params);
		return new Promise(resolve => {
            this.ionicHttp.get(url, {}, {})
			  .then(data => {
            	resolve(JSON.parse(data.data));
			  })
			  .catch(error => {
			  	resolve(JSON.parse(error.error));
		  	});
        });
	}

	WCMPVendorIonic(endPoint, params = {}){
		const url = this.config.setUrl('GET', '/wp-json/wcmp/v1/' + endPoint + '?', params);
		return new Promise(resolve => {
            this.ionicHttp.get(url, {}, {})
			  .then(data => {
            	resolve(JSON.parse(data.data));
			  })
			  .catch(error => {
			  	resolve(JSON.parse(error.error));
		  	});
        });
	}

	async presentAlert(error) {
		let message = '';
		if(error.data && error.data.params)
		for (const property in error.data.params) {
		  message = message + `${property}: ${error.data.params[property]}`;
		}
	    const alert = await this.alertController.create({
	      header: 'Alert',
	      subHeader: error.message,
	      message: message,
	      buttons: ['OK']
	    });

	    await alert.present();
	}

	async checkUrl(url) {
		if (this.platform.is('hybrid')) {
			return new Promise((resolve, reject) => {
	            this.ionicHttp.get(url, {}, {})
				  .then(data => {
	            	resolve(JSON.parse(data.data));
				  })
				  .catch(error => {
				    reject(JSON.parse(error.error));
			  	});
	        });
		} else {
			return new Promise((resolve, reject) => {
	            this.http.get(url).pipe(map((res: any) => res)).subscribe(data => {
	                resolve(data);
	            }, err => {
	            	reject(err.error);
	            });
	        });
		}
	}

	getItemWihtoutAlert(endPoint, filter = {}) {
		const url = this.config.setUrl('GET', endPoint + '?', filter);
		if (this.platform.is('hybrid')) {
			return new Promise((resolve, reject) => {
	            this.ionicHttp.get(url, {}, {})
				  .then(data => {
	            	resolve(JSON.parse(data.data));
				  })
				  .catch(error => {
				    reject(JSON.parse(error.error));
			  	});
	        });
		} else {
			return new Promise((resolve, reject) => {
	            this.http.get(url).pipe(map((res: any) => res)).subscribe(data => {
	                resolve(data);
	            }, err => {
	            	reject(err.error);
	            });
	        });
		}
	}

}
