import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent implements OnInit{


  product: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.productService.getProductById(id).subscribe(res => {
        this.product = res;
        this.loading = false;
      });
    }
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
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
}
