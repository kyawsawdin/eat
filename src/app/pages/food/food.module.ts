import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodPageRoutingModule } from './food-routing.module';

import { FoodPage } from './food.page';

import { ProductSkeletonComponentModule } from './../../container/skeleton/product-skeleton/product-skeleton.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProductListItemComponentModule } from './../../container/products/product-list-item/product-list-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodPageRoutingModule,
    TranslateModule,
    ProductSkeletonComponentModule,
    ProductListItemComponentModule
  ],
  declarations: [FoodPage]
})
export class FoodPageModule {}
