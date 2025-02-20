import { Routes } from '@angular/router';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
    {path: 'cart-details', component: CartDetailsComponent},
    {path:'products/:id', component: ProductDetailComponent},
    {path:'search/:keyWord', component: ProductListComponent},
    {path:'category/:id/:name', component: ProductListComponent},
    {path:'category', component: ProductListComponent},
    {path:'products', component: ProductListComponent},
    {path:'', redirectTo: '/products', pathMatch: 'full'},
    {path:'**', redirectTo: '/products', pathMatch: 'full' }
];
