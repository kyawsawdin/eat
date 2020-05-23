import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductListItemComponent } from './product-list-item.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [ProductListItemComponent],
  exports: [ProductListItemComponent]
})
export class ProductListItemComponentModule {}
