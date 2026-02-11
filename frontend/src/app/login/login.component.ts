import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    username: '',
    password: '',
  };


  constructor(private authservice:AuthService, private router:Router) {}
  onLogin(form:NgForm) {
    console.log("this is login ts")
    if (form.invalid) return;

    this.authservice.Login(this.loginData).subscribe({
     next: (res: any) => {
  console.log("login success", res);

  localStorage.setItem('token', res.token);
  localStorage.setItem('usertype', res.usertype);
  localStorage.setItem('is_superuser', res.is_superuser);

  localStorage.setItem(
    'role',
    res.is_superuser ? 'admin' : res.usertype
  );

  this.authservice.setRole(
    res.is_superuser ? 'admin' : res.usertype
  );

  if (res.is_superuser || res.usertype === 'admin') {
    this.router.navigate(['/admin_h']);
  } else if (res.usertype === 'customer') {
    this.router.navigate(['/home']);
  } else if (res.usertype === 'seller') {
    this.router.navigate(['/home']);
  } else {
  this.router.navigate(['/']);
}
    },
      error: (err: any) => {
        console.error( err,"//////////////////////");
        alert("Login failed. Please check your credentials and try again.");
      }
    });
  }
}