import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroceryPageRoutingModule } from './grocery-routing.module';

import { GroceryPage } from './grocery.page';

import { ProductSkeletonComponentModule } from './../../container/skeleton/product-skeleton/product-skeleton.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroceryPageRoutingModule,
    TranslateModule,
    ProductSkeletonComponentModule
  ],
  declarations: [GroceryPage]
})
export class GroceryPageModule {}
