import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private listUrl = 'https://kaira-ecommerce-backend.onrender.com/api/products/';
  private editUrl = 'https://kaira-ecommerce-backend.onrender.com/api/product/edit/';
  private baseUrl = 'https://kaira-ecommerce-backend.onrender.com/api';
  private addProductUrl = 'https://kaira-ecommerce-backend.onrender.com/api/products/add/';


  constructor(private http: HttpClient) {}

  addProduct(data: FormData): Observable<any> {
    return this.http.post(this.addProductUrl, data);
  }

  // getProducts(): Observable<any> {

  //   return this.http.get(this.listUrl);
  // }



  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.editUrl}${id}/`);
  }

  updateProduct(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.editUrl}${id}/`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.editUrl}${id}/`);
  }

 
getProducts(search: string = '') {
  let url = 'https://kaira-ecommerce-backend.onrender.com/api/products/';

  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }

  return this.http.get<any[]>(url);
}



  
}
