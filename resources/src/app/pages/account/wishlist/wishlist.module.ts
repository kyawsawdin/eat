import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishlistPageRoutingModule } from './wishlist-routing.module';

import { WishlistPage } from './wishlist.page';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    WishlistPageRoutingModule
  ],
  declarations: [WishlistPage]
})
export class WishlistPageModule {}
