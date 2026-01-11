import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private listUrl = 'http://127.0.0.1:8000/api/products/';
  private editUrl = 'http://127.0.0.1:8000/api/product/edit/';

  constructor(private http: HttpClient) {}

  addProduct(data: FormData): Observable<any> {
    return this.http.post(this.listUrl, data);
  }

  getProducts(): Observable<any> {
    return this.http.get(this.listUrl);
  }



  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.editUrl}${id}/`);
  }

  updateProduct(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.editUrl}${id}/`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.editUrl}${id}/`);
  }
}
