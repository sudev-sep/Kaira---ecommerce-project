import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private baseUrl = 'https://kaira-ecommerce-backend.onrender.com/api';

  constructor(private http: HttpClient) {}

  getReviews(productId: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/reviews/${productId}/`
    );
  }

  addReview(productId: number, data: any) {
    return this.http.post(
      `${this.baseUrl}/reviews/${productId}/`,
      data
    );
  }
}
