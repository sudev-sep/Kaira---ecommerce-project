// header.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Observable, Subscription } from 'rxjs';

type UserRole = 'admin' | 'seller' | 'customer' | null;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  role: UserRole = null;
  private roleSub?: Subscription;

  cartCount$!: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // subscribe to role changes so header updates reactively after login/logout
    this.roleSub = this.authService.role$.subscribe(storedRole => {
      this.role = (storedRole as UserRole) || null;
      this.isLoggedIn = this.authService.isLoggedIn();
    });

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

  ngOnDestroy(): void {
    this.roleSub?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }


  
}

