import { Component, OnInit, NgZone } from '@angular/core';
import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];

  giftWrap: boolean = false;
  giftWrapCharge: number = 50;
  convenienceFee: number = 20;
  shippingCharge: number = 30;
  gstRate: number = 0.18;
  showExtraCharges: boolean = false;


  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }


  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cartItems = res.items || [];
      },
      error: (err) => console.error(err)
    });
  }

  removeFromCart(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe(() => {
      this.loadCart();
    });
  }


  getTotalItems(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getGiftWrapAmount(): number {
    return this.giftWrap ? this.giftWrapCharge : 0;
  }

  getGstAmount(): number {
    return Math.round(this.getSubtotal() * this.gstRate);
  }

  getShippingCharge(): number {
    return this.shippingCharge;
  }

  getConvenienceFee(): number {
    return this.convenienceFee;
  }

  getPayableAmount(): number {
    return (
      this.getSubtotal() +
      this.getGiftWrapAmount() +
      this.convenienceFee +
      this.shippingCharge +
      this.getGstAmount()
    );
  }

  

  purchase(): void {

    const options: any = {
      key: 'rzp_test_ifqXZb84qSL1CP',
      amount: this.getPayableAmount() * 100, 
      currency: 'INR',
      name: 'Demo Shop',
      description: 'Order Payment',

      handler: (response: any) => {
        this.zone.run(() => {
          this.http.post('http://localhost:8000/api/checkout/', {
            payment_id: response.razorpay_payment_id,
            status: 'success',

            subtotal: this.getSubtotal(),
            gift_wrap: this.giftWrap,
            gift_wrap_amount: this.getGiftWrapAmount(),
            convenience_fee: this.convenienceFee,
            shipping_charge: this.shippingCharge,
            gst_amount: this.getGstAmount(),
            total_paid: this.getPayableAmount(),

            items: this.cartItems
          }).subscribe(() => {

            alert('Payment Successful ! Your order has been placed.');

            this.cartItems = [];
            this.cartService.updateCartCount(0);
            this.loadCart();

          });
        });
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }




toggleExtraCharges() {
  this.showExtraCharges = !this.showExtraCharges;
}


}
