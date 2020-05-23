import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
