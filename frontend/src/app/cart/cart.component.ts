import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';  

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cartItems = res.items;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  getTotalItems(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
  }

  removeItem(itemId: number) {
    this.cartService.removeFromCart(itemId).subscribe(() => {
      this.loadCart();
    });
  }
  

 
purchase() {
  const options: any = {
    key: 'rzp_test_ifqXZb84qSL1CP', 
    amount: this.getTotalPrice() * 100,
    currency: 'INR',
    name: 'Demo Shop',
    description: 'Demo Purchase',

    handler: (response: any) => {
      // TRUST demo payment
      this.http.post('http://localhost:8000/api/checkout/', {
        payment_id: response.razorpay_payment_id,
        status: 'success'
      }).subscribe(() => {
        alert('Demo Payment Successful');
        this.cartItems = [];
      });
    }
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}


removeFromCart(itemId: number) {
  this.cartService.removeFromCart(itemId).subscribe(() => {
    this.loadCart();
  });


}}
