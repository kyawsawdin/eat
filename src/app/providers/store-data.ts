import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class StoreData {
  
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public storage: NativeStorage
  ) { }

  setStoreName(storename: string): Promise<any> {
    return this.storage.setItem('storename', storename);
  }

  getStoreName(): Promise<string> {
    return this.storage.getItem('storename').then((value) => {
      return value;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.getItem(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }
}
