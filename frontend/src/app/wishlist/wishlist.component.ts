import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';   

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  wishlistItems: any[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistService.getWishlist().subscribe(res => {
      this.wishlistItems = res;
      this.wishlistService.updateWishlistCount(res.length);
    });
  }

  removeFromWishlist(productId: number): void {
  this.wishlistService.removeFromWishlist(productId).subscribe({
    next: () => {
      this.wishlistItems = this.wishlistItems.filter(
        item => item.id !== productId 
      );
      this.wishlistService.updateWishlistCount(this.wishlistItems.length);
    },
    error: err => {
      if (err.status === 404) {
        alert('Product not found in wishlist');
      } else if (err.status === 401) {
        alert('Please login to remove items from wishlist');
      } else {
        alert('Failed to remove from wishlist');
      }
    }
  });
}


addToCart(productId: number): void {

    if (!this.authService.isLoggedIn()) {
      const confirmLogin = confirm('Please login to add items to cart');

      if (confirmLogin) {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: '/' }
        });
      }
      return;
    }
    this.cartService.addToCart(productId).subscribe({
      next: () => alert('Added to cart'),
      error: err => {
        alert(err.status === 401 ? 'Please login first' : 'Failed to add to cart');
      }
    });
  }


  goToItem(id: number) {
  this.router.navigate(['/item', id]);
}

}
