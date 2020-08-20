import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tutorial',
    pathMatch: 'full'
  },
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'select-products/:id',
    loadChildren: () => import('./pages/orders/select-products/select-products.module').then( m => m.SelectProductsPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/orders/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'wishlist',
    loadChildren: () => import('./pages/account/wishlist/wishlist.module').then( m => m.WishlistPageModule)
  },
  {
    path: 'address',
    loadChildren: () => import('./pages/account/address/address.module').then( m => m.AddressPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/account/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'product-detail/:id',
    loadChildren: () => import('./pages/product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
  },
  {
    path: 'order-summary/:id',
    loadChildren: () => import('./pages/orders/order-summary/order-summary.module').then( m => m.OrderSummaryPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./pages/account/wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'language',
    loadChildren: () => import('./pages/account/language/language.module').then( m => m.LanguagePageModule)
  },
  {
    path: 'wallet-topup',
    loadChildren: () => import('./pages/account/wallet-topup/wallet-topup.module').then( m => m.WalletTopupPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'address',
    loadChildren: () => import('./pages/account/address/address.module').then( m => m.AddressPageModule)
  },
  {
    path: 'edit-address',
    loadChildren: () => import('./pages/account/edit-address/edit-address.module').then( m => m.EditAddressPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
