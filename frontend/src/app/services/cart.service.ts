import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://127.0.0.1:8000/api/cart/';

  private cartCountSource = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSource.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /* =======================
     GET CART
  ======================= */
  getCart(): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of(null);
    }
    return this.http.get<any>(this.apiUrl);
  }

  /* =======================
     GET CART ITEMS
  ======================= */
  getCartItems(): Observable<any[]> {
    if (!this.authService.isLoggedIn()) {
      return of([]);
    }
    return this.http.get<any[]>(this.apiUrl);
  }

  /* =======================
     ADD TO CART
  ======================= */
  addToCart(productId: number): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of(null);
    }

    return this.http.post(`${this.apiUrl}add/`, {
      product_id: productId,
      quantity: 1
    }).pipe(
      tap(() => this.recalcCartCount())
    );
  }

  /* =======================
     REMOVE FROM CART
  ======================= */
  removeFromCart(itemId: number): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of(null);
    }

    return this.http.delete(`${this.apiUrl}remove/${itemId}/`).pipe(
      tap(() => this.recalcCartCount())
    );
  }

  /* =======================
     UPDATE QUANTITY
  ======================= */
  updateQuantity(itemId: number, quantity: number): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of(null);
    }

    return this.http.put(`${this.apiUrl}update/${itemId}/`, {
      quantity
    }).pipe(
      tap(() => this.recalcCartCount())
    );
  }

  /* =======================
     CHECKOUT
  ======================= */
  checkout(): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of(null);
    }

    return this.http.post(`${this.apiUrl}checkout/`, {});
  }

  /* =======================
     CART COUNT
  ======================= */
  updateCartCount(count: number): void {
    this.cartCountSource.next(count);
  }

  private recalcCartCount(): void {
    if (!this.authService.isLoggedIn()) {
      this.updateCartCount(0);
      return;
    }

    this.getCart().subscribe(cart => {
      const count =
        cart?.items?.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        ) || 0;

      this.updateCartCount(count);
    });
  }

  
}
