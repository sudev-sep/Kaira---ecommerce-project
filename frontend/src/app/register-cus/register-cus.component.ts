import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-cus',
  templateUrl: './register-cus.component.html',
  styleUrls: ['./register-cus.component.css']
})
export class RegisterCusComponent {
  customer = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  };

 

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  onregister(form: NgForm) {
    if (form.invalid) return;

    const customerData = {
      first_name: this.customer.first_name,
      last_name: this.customer.last_name,
      username: this.customer.username,
      email: this.customer.email,
      password: this.customer.password,
      usertype: 'customer',
      phone_number: this.customer.phone,
      address: this.customer.address,
    };

    this.authService.registerCustomer(customerData).subscribe(
      (res: any) => {
        console.log("✅ Registered Successfully", res);
        alert("Registration successful!");
       this.router.navigate(['/login']);       },
      (err: any) => {
        console.error("❌ Registration Error:", err);
        alert("Registration failed. Please try again.");
      }
    );
  }
  
 

}
