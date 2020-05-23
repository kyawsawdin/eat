import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectProductsPageRoutingModule } from './select-products-routing.module';

import { SelectProductsPage } from './select-products.page';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SelectProductsPageRoutingModule
  ],
  declarations: [SelectProductsPage]
})
export class SelectProductsPageModule {}
