import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

Swiper.use([Navigation, Pagination]);

declare const AOS: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {

  products: any[] = [];

  wishlistProductIds: number[] = [];

  userRole: string | null = null;
  isLoggedIn = false;
  currentIndex = 0;

  private swipers: Swiper[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router
  ) {}


  ngOnInit(): void {

    setInterval(() => {
    this.currentIndex = (this.currentIndex + 1) % 3;
  }, 4000);
    this.loadProducts();
    this.userRole = localStorage.getItem('role');
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadWishlist();
    
    
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1200, once: true });
      }
    }, 100);

    this.isLoggedIn = this.authService.isLoggedIn();


  }

  ngOnDestroy(): void {
    this.destroySwipers();
  }

  loadWishlist(): void {
    if (this.authService.isLoggedIn() && this.userRole === 'customer') {
      this.wishlistService.getWishlist().subscribe({
        next: (items: any[]) => {
          this.wishlistProductIds = items.map(item => item.product_id || item.id);
        },
        error: () => {
          this.wishlistProductIds = [];
        }
      });
    } else {
      this.wishlistProductIds = [];
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds.includes(productId);
  }


  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (res: any[]) => {
        this.products = this.prepareProducts(res);
        this.safeInitSwipers();
      },
      error: () => {
        this.products = this.getSampleProducts();
        this.safeInitSwipers();
      }
    });
  }

  private prepareProducts(products: any[]): any[] {
    if (!products || !products.length) {
      return this.getSampleProducts();
    }

    return products.map(p => ({
      ...p,
      image: p.image
        ? p.image.startsWith('http')
          ? p.image
          : `http://127.0.0.1:8000${p.image.startsWith('/') ? '' : '/media/'}${p.image}`
        : 'assets/images/product-placeholder.jpg'
    }));
  }

  private getSampleProducts(): any[] {
    return [
      { id: 1, name: 'Sample Product 1', price: 95, image: 'assets/images/product-item-1.jpg' },
      { id: 2, name: 'Sample Product 2', price: 55, image: 'assets/images/product-item-2.jpg' },
      { id: 3, name: 'Sample Product 3', price: 65, image: 'assets/images/product-item-3.jpg' }
    ];
  }

  
 

  private safeInitSwipers(): void {
    setTimeout(() => this.initSwipers(), 300);
  }

  private initSwipers(): void {
    this.destroySwipers();

    const main = document.querySelector('.main-swiper') as HTMLElement;
    if (main) {
      this.swipers.push(
        new Swiper(main, {
          slidesPerView: 3,
          spaceBetween: 30,
          loop: true,
          navigation: {
            nextEl: main.closest('section')?.querySelector('.icon-arrow-right') as HTMLElement,
            prevEl: main.closest('section')?.querySelector('.icon-arrow-left') as HTMLElement
          },
          breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 }
          }
        })
      );
    }

    document.querySelectorAll('.product-carousel').forEach(section => {

      const swiperEl = section.querySelector('.product-swiper') as HTMLElement;
      if (!swiperEl) return;

      const next = section.querySelector('.icon-arrow-right') as HTMLElement;
      const prev = section.querySelector('.icon-arrow-left') as HTMLElement;

      this.swipers.push(
        new Swiper(swiperEl, {
          slidesPerView: 4,
          spaceBetween: 20,
          loop: true,
          navigation: next && prev ? {
            nextEl: next,
            prevEl: prev
          } : undefined,
          breakpoints: {
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1200: { slidesPerView: 4 }
          }
        })
      );

    });
  }

  private destroySwipers(): void {
    this.swipers.forEach(s => s.destroy(true, true));
    this.swipers = [];
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
toggleWishlist(productId: number) {
    this.wishlistService.toggleWishlist(productId).subscribe({
      next: (res: any) => {
        alert(res.message || 'Wishlist updated');
        this.loadWishlist();
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


}



