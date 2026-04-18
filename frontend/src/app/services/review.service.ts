import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private baseUrl = 'http://127.0.0.1:8000/api';

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
