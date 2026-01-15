import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
   selector: 'app-product-page',
  templateUrl: './product-page.component.html',  
  styleUrls: ['./product-page.component.css']
})

export class ProductPageComponent implements OnInit {
  products: any[] = [];
  searchTerm = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

 ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.searchTerm = params['search'] || '';

    this.productService
      .getProducts(this.searchTerm)
      .subscribe(res => {
        this.products = res;
      });
  });
}

}