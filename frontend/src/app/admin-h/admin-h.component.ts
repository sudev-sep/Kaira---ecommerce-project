import {Component,OnInit,OnDestroy,ViewChild,ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-h',
  templateUrl: './admin-h.component.html',
  styleUrls: ['./admin-h.component.css']
})
export class AdminHComponent implements OnInit, OnDestroy {

  @ViewChild('revenueCanvas') revenueCanvas!: ElementRef<HTMLCanvasElement>;

  section: string = 'dashboard';

  customers: any[] = [];
  sellers: any[] = [];
  products: any[] = [];

  stats: any = {};
  loading = true;

  chart: Chart | null = null;

  isLoggedIn = false;
  role: string | null = null;

  private API_URL = 'http://127.0.0.1:8000/api/admin/dashboard/';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // -------------------- LIFECYCLE --------------------

  ngOnInit(): void {

    this.isLoggedIn = !!localStorage.getItem('token');
    this.role = localStorage.getItem('role');

    this.route.queryParams.subscribe(params => {
      this.section = params['section'] || 'dashboard';

      if (this.section === 'dashboard') {
        setTimeout(() => {
          this.loadRevenueChart();
        });
      } else {
        this.destroyChart();
      }
    });

    this.loadDashboardStats();
    this.fetchcustomers();
    this.fetchsellers();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  // -------------------- DASHBOARD --------------------

  loadDashboardStats() {
    this.http.get(this.API_URL).subscribe({
      next: (res: any) => {
        this.stats = res;
        this.loading = false;
      },
      error: () => {
        alert('Failed to load admin dashboard data');
        this.loading = false;
      }
    });
  }

  loadRevenueChart() {
    this.http
      .get<any>('http://127.0.0.1:8000/api/admin/revenue-chart/')
      .subscribe(res => {
        this.destroyChart();
        this.createChart(res.labels, res.values);
      });
  }

  createChart(labels: string[], data: number[]) {
    if (!this.revenueCanvas) return;

    const ctx = this.revenueCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Monthly Revenue (₹)',
            data,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  // -------------------- CUSTOMERS --------------------

  fetchcustomers() {
    this.http
      .get<any[]>('http://127.0.0.1:8000/api/admin/customers/')
      .subscribe({
        next: data => (this.customers = data),
        error: err => console.error('Failed to load customers', err)
      });
  }

  deletecustomers(id: number) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    this.http
      .delete(`http://127.0.0.1:8000/api/admin/customerdelete/${id}/`)
      .subscribe({
        next: () => {
          alert('Customer deleted');
          this.fetchcustomers();
        },
        error: err => console.error('Delete failed', err)
      });
  }

  // -------------------- SELLERS --------------------

  fetchsellers() {
    this.http
      .get<any[]>('http://127.0.0.1:8000/api/admin/sellers/')
      .subscribe({
        next: data => (this.sellers = data),
        error: err => console.error('Failed to load sellers', err)
      });
  }

  deletesellers(id: number) {
    if (!confirm('Are you sure you want to delete this seller?')) return;

    this.http
      .delete(`http://127.0.0.1:8000/api/admin/delete-sellers/${id}/`)
      .subscribe({
        next: () => {
          alert('Seller deleted');
          this.fetchsellers();
        },
        error: err => console.error('Delete failed', err)
      });
  }

  addsellerView() {
    this.router.navigate(['/add-seller']);
  }

  // -------------------- PRODUCTS --------------------

  loadProducts() {
    const headers = {
      Authorization: `Token ${localStorage.getItem('token')}`
    };

    this.http
      .get<any[]>('http://127.0.0.1:8000/api/admin/products/', { headers })
      .subscribe({
        next: data => (this.products = data),
        error: err => console.error('Products load failed', err)
      });
  }

  productApprove(id: number) {
    const headers = {
      Authorization: `Token ${localStorage.getItem('token')}`
    };

    this.http
      .post(
        `http://127.0.0.1:8000/api/admin/approve-product/${id}/`,
        {},
        { headers }
      )
      .subscribe({
        next: () => {
          alert('Product approved');
          this.loadProducts();
        },
        error: err => console.error('Approve failed', err)
      });
  }

  deleteProduct(id: number) {
    const headers = {
      Authorization: `Token ${localStorage.getItem('token')}`
    };

    this.http
      .delete(
        `http://127.0.0.1:8000/api/admin/delete-product/${id}/`,
        { headers }
      )
      .subscribe({
        next: () => {
          alert('Product deleted');
          this.loadProducts();
        },
        error: err => console.error('Delete failed', err)
      });
  }
}
