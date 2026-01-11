import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-seller-h',
  templateUrl: './seller-h.component.html',
  styleUrls: ['./seller-h.component.css']
})
export class SellerHComponent {
// section2 = 'viewprofile';
  editing = false;
  seller: any = null;
  products: any[] = [];


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.loadProducts(); 
    this.getproduct();
  }

  loadProducts() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/seller/profile/products/').subscribe({
      next: data => this.products = data,
      error: err => console.error('Products load failed', err)
    });
  } 


  getProfile() {
    this.http.get<any>('http://127.0.0.1:8000/api/seller/profile/').subscribe({
      next: data => this.seller = data,
      error: err => console.error('Profile load failed', err)
    });
  }

 updateProfile() {
  this.authService.updatesellerprofile(this.seller).subscribe({
    next: () => {
      alert('Profile Updated Successfully!');
      this.getProfile(); 
    },
    error: err => {
      console.error('Update failed', err);
      alert('Update failed!');
    }
  });
}


  getproduct() {
      return this.http.get<any[]>('http://127.0.0.1:8000/api/seller/profile/products/').subscribe({
        next: data => this.products = data,
        error: err => console.error('Products load failed', err)
      });

  }


  deleteProduct(id: number) {
    this.http.delete(`http://127.0.0.1:8000/api/product/delete/${id}/`)
      .subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts();
        },
        error: err => {
          console.error('Delete failed', err);
          alert('Delete failed!');
        }
      });
  }

  logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}

}