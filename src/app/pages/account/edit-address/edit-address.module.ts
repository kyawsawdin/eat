import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAddressPageRoutingModule } from './edit-address-routing.module';

import { EditAddressPage } from './edit-address.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    EditAddressPageRoutingModule
  ],
  declarations: [EditAddressPage]
})
export class EditAddressPageModule {}
