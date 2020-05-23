import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeSkeletonComponent } from './home-skeleton.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [HomeSkeletonComponent],
  exports: [HomeSkeletonComponent]
})
export class HomeSkeletonComponentModule {}
