import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../pages/categories/categories.module').then( m => m.CategoriesPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../pages/search/search.module').then( m => m.SearchPageModule)
      },
      {
        path: 'store',
        loadChildren: () => import('../pages/store/store.module').then( m => m.StorePageModule)
      },
      {
        path: 'food',
        loadChildren: () => import('../pages/food/food.module').then( m => m.FoodPageModule)
      },
      {
        path: 'grocery',
        loadChildren: () => import('../pages/grocery/grocery.module').then(m => m.GroceryPageModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../pages/orders/cart/cart.module').then(m => m.CartPageModule)
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule),
          },
          {
            path: 'wishlist',
            loadChildren: () => import('../pages/account/wishlist/wishlist.module').then( m => m.WishlistPageModule)
          },
          {
            path: 'address',
            loadChildren: () => import('../pages/account/address/address.module').then( m => m.AddressPageModule)
          },
          {
            path: 'edit-address',
            loadChildren: () => import('../pages/account/edit-address/edit-address.module').then( m => m.EditAddressPageModule)
          },
          {
            path: 'orders',
            loadChildren: () => import('../pages/account/orders/orders.module').then( m => m.OrdersPageModule)
          },
          {
            path: 'wallet',
            loadChildren: () => import('../pages/account/wallet/wallet.module').then( m => m.WalletPageModule)
          },
          {
            path: 'language',
            loadChildren: () => import('../pages/account/language/language.module').then( m => m.LanguagePageModule)
          },
        ]
      },
      {
        path: '',
        redirectTo: '/app/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/app/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
