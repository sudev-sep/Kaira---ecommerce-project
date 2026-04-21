from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid,random
from django.conf import settings
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    usertype = models.CharField(max_length=20, choices=[('customer', 'Customer'), ('seller', 'Seller')])
    address = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    is_verified = models.BooleanField(default=False)


    def __str__(self):
        return self.username


class Seller(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller_profile')
    seller_id = models.CharField(max_length=50, unique=True, default=uuid.uuid4)  # or AutoField
    shop_name = models.CharField(max_length=100, null=True, blank=True)
    gst_number = models.CharField(max_length=50, null=True, blank=True)
    is_approved = models.BooleanField(default=True)

    def __str__(self):
        return self.shop_name or self.user.username



class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    customer_id = models.CharField(max_length=20, unique=True, editable=False)
    joined_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.customer_id:
            self.customer_id = f"CUST-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user.username


class Product(models.Model):
    seller = models.ForeignKey('Seller', on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    short_description = models.CharField(max_length=15000, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    image = models.URLField(blank=True, null=True)  
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.seller.user.username}"
    
class Order(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    shipping_address = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=30, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def line_total(self):
        return self.unit_price * self.quantity
    

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
     return f"Cart of {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')


    def __str__(self):
        return f"{self.product.name} ({self.quantity})"
    


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    product = models.ForeignKey('Product',on_delete=models.CASCADE,related_name='reviews')
    rating = models.IntegerField() 
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('user', 'product')  

    def __str__(self):
        return f"{self.user} - {self.product} ({self.rating})"




class OTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now=True)

    def generate_otp(self):
        self.otp = str(random.randint(100000, 999999))
        self.save()
