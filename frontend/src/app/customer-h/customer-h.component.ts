import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-h',
  templateUrl: './customer-h.component.html',
  styleUrls: ['./customer-h.component.css']
})
export class CustomerHComponent implements OnInit {
  // section2 = 'viewprofile';
  editing = false;
  customer: any = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    //  this.route.queryParams.subscribe(params => {
    //   this.section2=params['section2']||'viewteacher'||'editprofile';
    // })
    this.getProfile();
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
        // this.section2='viewprofile'
        this.getProfile();
      },
      error: err => {
        console.error('Update failed', err);
        alert('Update failed!');
      }
    });
  }
}
