import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletTopupPage } from './wallet-topup.page';

const routes: Routes = [
  {
    path: '',
    component: WalletTopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletTopupPageRoutingModule {}
