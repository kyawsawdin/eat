import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { TranslateModule } from '@ngx-translate/core';

import { ProductSkeletonComponentModule } from './../../container/skeleton/product-skeleton/product-skeleton.module';
import { ProductGridSkeletonComponentModule } from './../../container/skeleton/product-grid-skeleton/product-grid-skeleton.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    TranslateModule,
    ProductSkeletonComponentModule,
    ProductGridSkeletonComponentModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
