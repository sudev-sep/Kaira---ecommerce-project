import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-h',
  templateUrl: './customer-h.component.html',
  styleUrls: ['./customer-h.component.css']
})
export class CustomerHComponent implements OnInit {
  section2 = 'cus-profile';
  editing = false;
  customer: any = null;
  orders: any[] = [];

   otp = '';
  showOtpBox = false;
  user: any = {};
  


  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
     this.route.queryParams.subscribe(params => {
      this.section2=params['section2']||'cus-profile'||'edit';
    })
    this.getProfile();
    this.getOrderHistory();
    this.user.is_verified = this.customer?.is_verified || false;
  }

getProfile() {
  this.http.get<any>('https://kaira-ecommerce-backend.onrender.com/api/customer/profile/')
    .subscribe({
      next: data => {
        this.customer = data;
      },
      error: err => console.error('Profile load failed', err)
    });
}


  updateProfile() {
    if (this.customer && this.customer.customer) {
      delete this.customer.customer.username;
    }
    this.http.put('https://kaira-ecommerce-backend.onrender.com/customer/update/', this.customer).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        this.editing = false;
        this.getProfile();
      },
      error: err => {
        console.error('Update failed', err);
        alert('Update failed!');
      }
    });
  }

   showOrders() {
    this.section2 = 'orders';
    this.getOrderHistory();
  }

  
      getOrderHistory() {
        const token = localStorage.getItem('token'); 
        this.http.get<any[]>('https://kaira-ecommerce-backend.onrender.com/api/orders/customer/', {
          headers: { Authorization: `Token ${token}` }
        })
        .subscribe({
          next: (res) => {
            this.orders = res;
          },
          error: (err) => {
            console.error('Failed to load orders', err);
          }
        });
      }

       sendOTP() {
  this.http.post('https://kaira-ecommerce-backend.onrender.com/api/otp/send/', {})
    .subscribe(() => {
      alert('OTP sent');
      this.showOtpBox = true;
    });
}

verifyOTP() {
  this.http.post('https://kaira-ecommerce-backend.onrender.com/api/otp/verify/', {
    otp: this.otp
  }).subscribe({
    next: () => {
      alert('Account verified');
      this.showOtpBox = false;
      this.getProfile(); 
    },
    error: () => alert('Invalid OTP')
  });
}


  }
