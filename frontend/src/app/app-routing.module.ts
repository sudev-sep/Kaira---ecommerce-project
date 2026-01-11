import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterCusComponent } from './register-cus/register-cus.component';
import { LoginComponent } from './login/login.component';
import { AdminHComponent } from './admin-h/admin-h.component';
import { CustomerHComponent } from './customer-h/customer-h.component';
import { SellerHComponent } from './seller-h/seller-h.component';
import { AddSellerComponent } from './add-seller/add-seller.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { IndexComponent } from './index/index.component';
import { CartComponent } from './cart/cart.component';
import { AboutComponent } from './about/about.component';



const routes: Routes = [
    { path: 'register', component: RegisterCusComponent },
    { path: "login", component: LoginComponent },
    { path: "admin_h", component: AdminHComponent },  
    { path: "add-seller", component: AddSellerComponent },
    { path: "customer_h", component: CustomerHComponent },
    { path: "seller_h", component: SellerHComponent },  
    { path: "add-product", component: ProductAddComponent },
    { path: 'product-edit/:id', component: ProductEditComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: IndexComponent },
    { path: 'cart', component:CartComponent},
    { path: 'about', component:AboutComponent}
    


];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
