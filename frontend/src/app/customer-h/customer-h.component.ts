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
  


  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
     this.route.queryParams.subscribe(params => {
      this.section2=params['section2']||'cus-profile'||'edit';
    })
    this.getProfile();
    this.getOrderHistory();
  }

  getProfile() {
    this.http.get<any>('http://127.0.0.1:8000/api/customer/profile/').subscribe({
      next: data => this.customer = data,
      error: err => console.error('Profile load failed', err)
    });
  }

  updateProfile() {
    if (this.customer && this.customer.customer) {
      delete this.customer.customer.username;
    }
    this.http.put('http://127.0.0.1:8000/api/customer/update/', this.customer).subscribe({
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
        this.http.get<any[]>('http://localhost:8000/api/orders/customer/', {
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
    }