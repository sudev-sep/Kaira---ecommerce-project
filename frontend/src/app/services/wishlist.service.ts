import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlistCountSubject = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(private http: HttpClient) {}


  getWishlist() {
    return this.http.get<any[]>('https://kaira-ecommerce-backend.onrender.com/api/wishlist/');
  }

  toggleWishlist(productId: number) {
    return this.http.post<any>(
      'https://kaira-ecommerce-backend.onrender.com/api/wishlist/toggle/',
      { product_id: productId }
    );
  }
  
  removeFromWishlist(productId: number) {
    return this.http.post<any>(
      'https://kaira-ecommerce-backend.onrender.com/api/wishlist/remove/',
      { product_id: productId }
    );
  }



  updateWishlistCount(count: number) {
    this.wishlistCountSubject.next(count);
  }
}
