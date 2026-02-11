import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-seller',
  templateUrl: './add-seller.component.html',
  styleUrls: ['./add-seller.component.css']
})
export class AddSellerComponent {
  seller = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    shop_name: '',
    gst_number: '',
    phone_number: '',
    password: ''
  };

  constructor(private router: Router, private authservice: AuthService) {}

  submit(ngForm: any) {
    if (ngForm.invalid) return;
    console.log(this.seller);


    const sellerData = {
      username: this.seller.username,
      first_name: this.seller.first_name, 
      last_name: this.seller.last_name,
      email: this.seller.email,
      shop_name: this.seller.shop_name,
      gst_number: this.seller.gst_number,
      phone_number: this.seller.phone_number,
      password: this.seller.password
    };

    this.authservice.createSeller(sellerData).subscribe(
      (res: any) => {
        console.log(" Seller Created Successfully", res);

        console.log('Create seller', this.seller);
        alert('Seller created successfully!');
        this.router.navigate(['/admin_h']);
      },
      (err: any) => {
        console.error('Error creating seller', err);
      }
    );
  }

  cancel() {
    this.router.navigate(['/admin_h']);
  }
}
