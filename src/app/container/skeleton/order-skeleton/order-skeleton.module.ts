import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderSkeletonComponent } from './order-skeleton.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [OrderSkeletonComponent],
  exports: [OrderSkeletonComponent]
})
export class OrderSkeletonComponentModule {}
