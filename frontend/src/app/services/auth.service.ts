import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  registerCustomer(data: any) {
    return this.http.post('http://127.0.0.1:8000/register/customer/', data);
  }

  Login(data:any) {
    return this.http.post('http://127.0.0.1:8000/login/', data);
  }

  getProfile(data:any) {
    return this.http.get('http://127.0.0.1:8000/api/customer/profile/', data);
  }

  updateProfile(data:any) {
    return this.http.put('http://127.0.0.1:8000/api/customer/update/', data);
  }

    logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usertype');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }



  createSeller(data: any) {
    return this.http.post('http://127.0.0.1:8000/api/seller/register/',data);
}


updatesellerprofile(sellerData: any) {
  return this.http.put('http://127.0.0.1:8000/api/seller/update/', sellerData, {
    headers: {
      Authorization: `Token ${this.getToken()}`
    }
  });
}

getToken(): string | null {
  return localStorage.getItem('token');
}

updateProduct(Id: number, productData: any) {
  return this.http.put(`http://127.0.0.1:8000/api/product/edit/${Id}/`, productData, {
    headers: {
      Authorization: `Token ${this.getToken()}`
    }
  });
}

getRole(): string | null {
  return localStorage.getItem('usertype');   // 'admin' | 'seller' | 'customer'
}

getUsername(): string | null {
  return localStorage.getItem('username');
}

isLoggedIn(): boolean {
  return !!this.getToken();
}


}