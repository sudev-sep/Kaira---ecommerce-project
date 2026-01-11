import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  product: any = {};
  selectedImage: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Editing product ID:", id);

    this.productService.getProductById(id).subscribe((data: any) => {
      this.product = data;
    });
  }

  // ---------- FILE SELECTION ----------
  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  // ---------- UPDATE PRODUCT ----------
  updateProduct() {
    const formData = new FormData();

    formData.append("name", this.product.name);
    formData.append("short_description", this.product.short_description);
    formData.append("price", this.product.price);
    formData.append("stock", this.product.stock);

    if (this.selectedImage) {
      formData.append("image", this.selectedImage);
    }

    this.productService.updateProduct(this.product.id, formData)
      .subscribe(res => {
        console.log("Updated!", res);
        alert("Product updated successfully!");
        this.router.navigate(['/seller_h']);
      });
  }

}
