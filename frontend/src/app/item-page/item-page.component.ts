import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { WishlistService } from '../services/wishlist.service';
import { ReviewService } from '../services/review.service';


@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent implements OnInit {

  product: any;
  loading = true;
  rating = 0;
  comment = '';
  reviews: any[] = [];
  productId: number = 0;


  userRole = this.authService.getRole();
  isLoggedIn = this.authService.isLoggedIn();

  wishlistProductIds: number[] = []; 

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.productId = id;
      this.productService.getProductById(id).subscribe(res => {
        this.product = res;
        this.loading = false;
        this.loadReviews();

      });

    }


  }

  addToCart(): void {
    if (!this.isLoggedIn) {
      if (confirm('Please login to add items to cart')) {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: this.router.url }
        });
      }
      return;
    }

    this.cartService.addToCart(this.product.id).subscribe(() => {
      alert('Added to cart 🛒');
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds.includes(productId);
  }

  toggleWishlist(productId: number) {
    this.wishlistService.toggleWishlist(productId).subscribe({
      next: (res: any) => {
        alert(res.message || 'Wishlist updated');
        this.wishlistService.getWishlist().subscribe(wishlist => {
          const count = Array.isArray(wishlist) ? wishlist.length : 0;
          this.wishlistService.updateWishlistCount(count);
        });
      },
      error: err => {
        if (err.status === 401) {
          alert('Please login to use wishlist');
        } else {
          alert('Failed to update wishlist');
        }
      }
    });
  }


  loadReviews() {
    this.reviewService.getReviews(this.productId).subscribe(reviews => {
    this.reviews = reviews;   // ✅ FIX
    });
  }
  submitReview() {
  this.reviewService.addReview(this.productId, {
    rating: this.rating,
    comment: this.comment
  }).subscribe(() => {
    alert('commend added');
    this.loadReviews();
  });
}
}
