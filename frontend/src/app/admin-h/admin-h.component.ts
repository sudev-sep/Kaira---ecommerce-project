import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-h',
  templateUrl: './admin-h.component.html',
  styleUrls: ['./admin-h.component.css']
})
export class AdminHComponent {
  section: string = 'customers';
customers: any[] = [];
sellers: any[] = [];

constructor(private http: HttpClient, private authService: AuthService,
  private route: ActivatedRoute,
  private router: Router
) {}

ngOnInit(): void {
  // this.route.queryParams.subscribe(params => {
  //   this.section = params['section'] || 'sellers';
  // })
  this.fetchcustomers();
  this.fetchsellers();
}

fetchcustomers() {
  this.http.get<any[]>('http://127.0.0.1:8000/api/admin/customers/').subscribe({
    next: data => this.customers = data,
    error: err => console.error('Failed to load customers', err)
  });
  console.log(this.customers,"//////?????????????")
}

deletecustomers(id: number) {
  if(!confirm('are you sure yant to delete this customer?')) return;
  this.http.delete(`http://127.0.0.1:8000/api/admin/customerdelete/${id}/`)
    .subscribe({
      next: () => {
        alert('customer deleted');
        this.fetchcustomers();
      },
      error: (err: any) => console.error('Failed to delete customer', err)
    });
}

logoutview() {
  this.authService.logout();
  alert('logged out successfully')
}


fetchsellers() {
  this.http.get<any[]>('http://127.0.0.1:8000/api/admin/sellers/').subscribe({
    next: data => {
      this.sellers = data;
      console.log(this.sellers, "//// sellers fetched /////");
    },
    error: err => console.error('Failed to load sellers', err)
  });
}


approvesellers(id: number) {
  this.http.post(`http://127.0.0.1:8000/api/admin/approve-sellers/${id}/`, {})
    .subscribe({
      next: () => {
        alert('sellers approved');
        console.log(this.sellers);

        this.fetchsellers();
      },
      error: (err: any) => console.error('Failed to approve sellers', err)
    });
}




deletesellers(id: number) {
  if(!confirm('are you sure yant to delete this sellers?')) return;
  this.http.delete(`http://127.0.0.1:8000/api/admin/delete-sellers/${id}/`)
    .subscribe({
      next: () => {
        alert('sellers  deleted');
        this.fetchsellers();
      },
      error: (err: any) => console.error('Failed to delete sellers', err)
    });
}

addsellerView() {
  this.router.navigate(['/add-seller']);
}



}


