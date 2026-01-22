import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';


@Component({
   selector: 'app-product-page',
  templateUrl: './product-page.component.html',  
  styleUrls: ['./product-page.component.css']
})

export class ProductPageComponent implements OnInit {
  products: any[] = [];
  searchTerm = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

 ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.searchTerm = params['search'] || '';

    this.productService
      .getProducts(this.searchTerm)
      .subscribe(res => {
        this.products = res;
      });
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
}