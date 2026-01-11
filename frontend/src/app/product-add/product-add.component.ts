import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent {
  product: any = {};
  selectedImage: File | null = null;

  constructor(private productService: ProductService) {}

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('short_description', this.product.short_description);
    formData.append('price', this.product.price);
    formData.append('stock', this.product.stock);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.productService.addProduct(formData).subscribe({
      next: (res: any) => {
        alert(' Product added successfully!');
        this.product = {};
        this.selectedImage = {} as File;
        console.log(res);
      },
      error: (err: any) => {
        console.error(err);
        alert(' Failed to add product!');
      }
    });
  }
}
