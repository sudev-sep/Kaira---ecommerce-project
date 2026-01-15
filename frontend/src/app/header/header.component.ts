// header.component.ts
import {  OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Observable, Subscription } from 'rxjs';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';



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

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
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

  
  onSearch(event?: Event) {
  event?.preventDefault();

  console.log('Search clicked:', this.searchQuery); // 👈 ADD THIS

  if (!this.searchQuery.trim()) return;

  this.router.navigate(['/products'], {
    queryParams: { search: this.searchQuery }
  });
}


  
}

