import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private listUrl = 'http://127.0.0.1:8000/api/products/';
  private editUrl = 'http://127.0.0.1:8000/api/product/edit/';
  private baseUrl = 'http://127.0.0.1:8000/api';
  private addProductUrl = 'http://127.0.0.1:8000/api/products/add/';


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
  let url = 'http://127.0.0.1:8000/api/products/';

  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }

  return this.http.get<any[]>(url);
}



  
}
