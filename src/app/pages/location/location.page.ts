import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Service } from './../../api.service';
import { Storage } from '@ionic/storage';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { LS_USER_COORDS, LS_USER_ADDRESS } from './../shared/common';
declare var google;

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

 lat: any;
  long: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  options: GeolocationOptions;
  geoOptions: NativeGeocoderOptions;
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  map: any = {};
  userAddress: any = {};
  userCoords: any = {};
  isLoggedIn: any = false;

  isGetLatLng: boolean = false;
  isGetAddressFromLocation: boolean = false;
  errorMsg: string = '';
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    private router: Router,
    private navCtrl: NavController,
    private tc: ToastController,
    private storage: Storage,
    public service: Service,
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  ngOnInit() {
    this.loadUserMap();
    this.checkIsLoggedIn();
  }

  checkIsLoggedIn(){
    this.storage.get('isLoggedIn').then((value)=>{
      console.log("isLoggedIn", value);
      if(value){
        this.isLoggedIn = value;
      }
    }, (e)=>{
      console.log("error in checkIsLogin", e);
    })
  }

  setParams(){
    this.service.filter.longitude = this.long;
    this.service.filter.latitude = this.lat;
    this.service.filter.distance = 20;
    this.service.filter.address = this.userAddress;
  }

  async goSignIn(){
    if (this.userCoords === '' || this.userAddress == '') {
      this.presentToastMsg('Notice', 'cannot move to Login page because location info is empty.');
      return;
    }
    await localStorage.setItem(LS_USER_COORDS, this.userCoords);
    await localStorage.setItem(LS_USER_ADDRESS, this.userAddress);
    let location = {
        userCoords: this.userCoords,
        userAddress: this.userAddress
    }
    this.storage.set("location", location);
    this.setParams();
    this.storage.set("isDirty", true);
    let navigationExtras: NavigationExtras = {
        state: {
            pageDetails: {
                from: 'LoginPage'
            }
        }
    };
    this.navCtrl.navigateForward('/tabs/account/login', navigationExtras);
  }

  loadUserMap() {
    //FIRST GET THE LOCATION FROM THE DEVICE
    this.isGetLatLng = false;
    this.userCoords = localStorage.getItem(LS_USER_COORDS) ? localStorage.getItem(LS_USER_COORDS) : '';
    this.userAddress = localStorage.getItem(LS_USER_ADDRESS) ? localStorage.getItem(LS_USER_ADDRESS) : '';
    if (this.userCoords === '') {
      this.currentLoadUserMap();
    } else {
      this.geolocation.getCurrentPosition().then((resp) => {
        let coords = this.userCoords.split(",");
        this.lat = coords[0];
        this.long = coords[1];
        this.addMap(this.lat, this.long);
        this.getAddressFromCoords(this.lat, this.long);
        this.isGetLatLng = true;
      }).catch((error) => {
        let coords = this.userCoords.split(",");
        this.lat = coords[0];
        this.long = coords[1];
        this.addMap(this.lat, this.long);
        this.getAddressFromCoords(this.lat, this.long);
        this.isGetLatLng = true;
      });
    }
  }

  /**
   * get current location of user
   */
  currentLoadUserMap() {
    //FIRST GET THE LOCATION FROM THE DEVICE
    this.isGetLatLng = false;
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      this.userCoords = this.lat + "," + this.long;
      this.addMap(this.lat, this.long);
      this.getAddressFromCoords(this.lat, this.long);
      this.isGetLatLng = true;
       localStorage.setItem(LS_USER_COORDS, this.userCoords);
       localStorage.setItem(LS_USER_ADDRESS, this.userAddress);
      let location = {
        userCoords: this.userCoords,
        userAddress: this.userAddress
    }
    this.storage.set("location", location);
    this.setParams();
    this.storage.set("isDirty", true);
    }).catch((error) => {
      this.isGetLatLng = false;
      this.errorMsg = JSON.stringify(error);
      this.presentToastMsg('getCurrentPosition', this.errorMsg);
    });
  }

  /**
   * get Address from Coords.
   * @param lattitude 
   * @param longitude 
   */
  getAddressFromCoords(lattitude, longitude) {
    this.isGetAddressFromLocation = false;
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then(async (result: NativeGeocoderResult[]) => {
        console.log(JSON.stringify(result[0]));
        this.userAddress = result[0].subThoroughfare + " " + result[0].thoroughfare + "," + result[0].subLocality + "," + result[0].locality
          + "," + result[0].postalCode + "," + result[0].countryName;
        // this.autocomplete.input = this.userAddress;
        this.isGetAddressFromLocation = true;
      })
      .catch((error: any) => {
        this.isGetAddressFromLocation = false;
        this.errorMsg = JSON.stringify(error);
        //this.presentToastMsg('reverseGeocode', this.errorMsg);
      });
  }

  /**
   * get Coords from Address
   * @param address 
   */
  getCoordsFromAddress(address) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.isGetLatLng = false;
    this.nativeGeocoder.forwardGeocode(address)
      .then((result: NativeGeocoderResult[]) => {
        this.lat = result[0].latitude;
        this.long = result[0].longitude;
        this.userCoords = this.lat + "," + this.long;
        this.addMap(this.lat, this.long)
        this.isGetLatLng = true;
      }).catch((error: any) => {
        this.isGetLatLng = false;
        this.userCoords = '';
        this.errorMsg = JSON.stringify(error);
        this.presentToastMsg('forwardGeocode', this.errorMsg);
        this.userAddress = "";
      });
  }
  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults() {
    // if (this.autocomplete.input == '') {
    if (this.userAddress == '') {
      this.autocompleteItems = [];
      return;
    }
    // this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    this.GoogleAutocomplete.getPlacePredictions({ input: this.userAddress },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            console.log(">>>>>>>>>", prediction);

            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  //wE CALL THIS FROM EACH ITEM.
  SelectSearchResult(item) {
    this.userAddress = item.description;
    this.getCoordsFromAddress(this.userAddress);
    this.ClearAutocomplete();
  }

  //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
  ClearAutocomplete() {
    this.autocompleteItems = []
  }

  //sIMPLE EXAMPLE TO OPEN AN URL WITH THE PLACEID AS PARAMETER.
  GoTo() {
    return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=' + this.placeid;
  }

  /**
   * create a map and place a marker on it.
   * @param lat 
   * @param long 
   */
  addMap(lat, long) {
    let latLng = new google.maps.LatLng(lat, long);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      clickableIcons: false,
      streetViewControl: false,
      mapTypeControl: false,
      maxZoom: 15, // for max zoom
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();
  }
  /**
   * add marker
   */
  addMarker() {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  async goToHomePage() {

    if (this.userCoords === '' || this.userAddress == '') {
      this.presentToastMsg('Notice', 'cannot move to home page because location info is empty.');
      return;
    }
    await localStorage.setItem(LS_USER_COORDS, this.userCoords);
    await localStorage.setItem(LS_USER_ADDRESS, this.userAddress);
    let location = {
        userCoords: this.userCoords,
        userAddress: this.userAddress
    }
    this.storage.set("location", location);
    this.setParams();

    let navigationExtras: NavigationExtras = {
      state: {
        userAddressDetails: {
          userCoords: this.userCoords,
          userAddress: this.userAddress
          }
      }
  };

    this.navCtrl.navigateRoot(['/tabs/home'], navigationExtras);
    //this.navCtrl.navigateForward('/tabs/home', navigationExtras);
  }

  async presentToastMsg(title, message) {
    const toast = await this.tc.create({
      header: title,
      message: message,
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }
}
