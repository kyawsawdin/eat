import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailPageRoutingModule } from './product-detail-routing.module';

import { ProductDetailPage } from './product-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { KeysPipeModule } from './../../pipes/pipe.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    KeysPipeModule,
    ProductDetailPageRoutingModule
  ],
  declarations: [ProductDetailPage]
})
export class ProductDetailPageModule {}
