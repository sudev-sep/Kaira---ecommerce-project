import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('usertype'));
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  registerCustomer(data: any) {
    return this.http.post('https://kaira-ecommerce-backend.onrender.com/register/customer/', data);
  }

  Login(data:any) {
    return this.http.post('https://kaira-ecommerce-backend.onrender.com/login/', data);
  }

  getProfile(data:any) {
    return this.http.get('https://kaira-ecommerce-backend.onrender.com/api/customer/profile/', data);
  }

  updateProfile(data:any) {
    return this.http.put('https://kaira-ecommerce-backend.onrender.com/api/customer/update/', data);
  }

    logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usertype');
    localStorage.removeItem('username');
    this.setRole(null);
    this.router.navigate(['/login']);
  }



  createSeller(data: any) {
    return this.http.post('https://kaira-ecommerce-backend.onrender.com/api/seller/register/',data);
}


updatesellerprofile(sellerData: any) {
  return this.http.put('https://kaira-ecommerce-backend.onrender.com/api/seller/update/', sellerData, {
    headers: {
      Authorization: `Token ${this.getToken()}`
    }
  });
}

getToken(): string | null {
  return localStorage.getItem('token');
}

updateProduct(Id: number, productData: any) {
  return this.http.put(`https://kaira-ecommerce-backend.onrender.com/api/product/edit/${Id}/`, productData, {
    headers: {
      Authorization: `Token ${this.getToken()}`
    }
  });
}

getRole(): string | null {
  return localStorage.getItem('usertype');   
}
setRole(role: string | null) {
  if (role) {
    localStorage.setItem('usertype', role);
  } else {
    localStorage.removeItem('usertype');
  }
  this.roleSubject.next(role);
}


getUsername(): string | null {
  return localStorage.getItem('username');
}

isLoggedIn(): boolean {
  return !!this.getToken();
}


}