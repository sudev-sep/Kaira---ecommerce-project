import {  OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Observable, Subscription } from 'rxjs';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WishlistService } from '../services/wishlist.service';


type UserRole = 'admin' | 'seller' | 'customer' | null;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  isLoggedIn = false;
  role: UserRole = null;
  private roleSub?: Subscription;
  cartCount$!: Observable<number>;
  wishlistCount$!: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  
  ngOnInit(): void {
  this.roleSub = this.authService.role$.subscribe(storedRole => {
    this.role = (storedRole as UserRole) || null;
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn && this.role === 'customer') {
      this.wishlistCount$ = this.wishlistService.wishlistCount$;

      this.wishlistService.getWishlist().subscribe({
        next: (wishlist: any[]) => {
          const count = Array.isArray(wishlist) ? wishlist.length : 0;
          this.wishlistService.updateWishlistCount(count);
        },
        error: () => {
          this.wishlistService.updateWishlistCount(0);
        }
      });
    } else {
      this.wishlistService.updateWishlistCount(0);
    }
  });

  this.cartCount$ = this.cartService.cartCount$;
  this.cartService.getCart().subscribe(cart => {
    const items = cart.items || cart;
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

  
  onSearch(event?: Event) {
  event?.preventDefault();

  console.log('Search clicked:', this.searchQuery); 

  if (!this.searchQuery.trim()) return;

  this.router.navigate(['/products'], {
    queryParams: { search: this.searchQuery }
  });
}
  
}

