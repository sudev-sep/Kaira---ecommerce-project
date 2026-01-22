import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RegisterCusComponent } from './register-cus/register-cus.component';
import { LoginComponent } from './login/login.component';
import { Observable } from 'rxjs';
import { AdminHComponent } from './admin-h/admin-h.component';
import { CustomerHComponent } from './customer-h/customer-h.component';
import { SellerHComponent } from './seller-h/seller-h.component';
import { AddSellerComponent } from './add-seller/add-seller.component';
import { AuthInterceptor } from './auth.interceptor';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IndexComponent } from './index/index.component';
import { CartComponent } from './cart/cart.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { ItemPageComponent } from './item-page/item-page.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterCusComponent,
    LoginComponent,
    AdminHComponent,
    CustomerHComponent,
    SellerHComponent,
  AddSellerComponent,
  ProductAddComponent,
  ProductEditComponent,
  IndexComponent,
  CartComponent,
  HeaderComponent,
  FooterComponent,
  AboutComponent,
  ProductPageComponent,
  ItemPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true 
  }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
