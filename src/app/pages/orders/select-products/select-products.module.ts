import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectProductsPageRoutingModule } from './select-products-routing.module';

import { SelectProductsPage } from './select-products.page';

import { TranslateModule } from '@ngx-translate/core';

import { ProductSkeletonComponentModule } from './../../../container/skeleton/product-skeleton/product-skeleton.module';
import { ProductGridSkeletonComponentModule } from './../../../container/skeleton/product-grid-skeleton/product-grid-skeleton.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SelectProductsPageRoutingModule,
    ProductSkeletonComponentModule,
    ProductGridSkeletonComponentModule
  ],
  declarations: [SelectProductsPage]
})
export class SelectProductsPageModule {}
