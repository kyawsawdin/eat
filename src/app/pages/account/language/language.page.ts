import { Component, OnInit } from '@angular/core';
import { Settings } from './../../../data/settings';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Values } from './../../../values';
import { Service } from './../../../api.service';
import { Config } from './../../../config';
import { TranslateService } from '@ngx-translate/core';
import { Config as IonicConfig } from '@ionic/angular';
//import { HomePage} from 'src/app/pages/home/home.page';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {

  constructor(/*public home: HomePage, */ public ionicConfig: IonicConfig, public nativeStorage: NativeStorage, public translateService: TranslateService, public settings: Settings, public values: Values, public service: Service, public config: Config) { }
applyLanguage(){
      this.translateService.setDefaultLang(this.config.lang);
      if(this.config.lang == 'ar'){
        this.settings.dir = 'rtl';
      } else this.settings.dir = 'ltr';
      this.translateService.get(['Back']).subscribe(translations => {
          this.ionicConfig.set('backButtonText', translations['Back']);
      });
      document.documentElement.setAttribute('dir', this.settings.dir);
      this.nativeStorage.setItem('settings', {lang: this.config.lang, dir: this.settings.dir})
        .then(
          () => console.log(),
          error => console.error(error)
      );
      //this.home.getBlocks();
      //this.navCtrl.pop();
    }
  ngOnInit() {
  }

}
