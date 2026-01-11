// header.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Observable } from 'rxjs';

type UserRole = 'admin' | 'seller' | 'customer' | null;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  role: UserRole = null;

  cartCount$!: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // auth state from localStorage via AuthService
    this.isLoggedIn = this.authService.isLoggedIn();
    const storedRole = this.authService.getRole();
    this.role = (storedRole as UserRole) || null;
    if (this.isLoggedIn) {
     this.cartCount$ = this.cartService.cartCount$;
    }


    // cart count observable for async pipe in template
    this.cartCount$ = this.cartService.cartCount$;

    // initialize cart count from backend once
    this.cartService.getCart().subscribe(cart => {
      const items = cart.items || cart; // adjust to your API shape
      const count = Array.isArray(items)
        ? items.reduce((sum: number, i: any) => sum + (i.quantity || 0), 0)
        : 0;
      this.cartService.updateCartCount(count);
    });
  }

  logout(): void {
    this.authService.logout();
  }


  
}


