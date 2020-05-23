import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

import { TranslateModule } from '@ngx-translate/core';

import { HomeSkeletonComponentModule } from './../../container/skeleton/home-skeleton/home-skeleton.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule,
    HomeSkeletonComponentModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
