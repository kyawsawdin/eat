import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductSkeletonComponent } from './product-skeleton.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [ProductSkeletonComponent],
  exports: [ProductSkeletonComponent]
})
export class ProductSkeletonComponentModule {}
