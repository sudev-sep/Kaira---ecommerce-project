"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls.static import static
from myapp import views
from django.conf import settings
from django.urls import path, re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/customer/', views.RegisterCustomer.as_view(), name='register_customer'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('api/customer/profile/', views.CustomerProfileView.as_view(), name='customerprofile'),
    path('api/customer/update/', views.CustomerProfileUpdateView.as_view(), name='customer_update'),
    path('api/admin/customers/', views.AdminCustomerListView.as_view(), name='admin_customers'),
    path('api/admin/sellers/', views.AdminSellerListView.as_view(), name='admin_sellers'),
    path('api/admin/delete-sellers/<int:id>/', views.DeleteSellerView.as_view(), name='delete_seller'),
    path('api/admin/customerdelete/<int:pk>/', views.DeleteCustomerAdminView.as_view(), name='delete_customer'),
    path('api/seller/register/', views.RegisterSeller.as_view(), name='register_seller'),
    path('api/seller/profile/', views.sellerprofileview.as_view(), name='seller_profile'),
    path('api/products/', views.ProductViewSet.as_view({'get': 'list', 'post': 'create'}), name='product_list_create'),
    path('api/products/<int:pk>/', views.ProductViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='product_detail'),
    path('api/product/edit/<int:id>/', views.ProductEditView.as_view(), name='product_edit'),
    path('api/product/delete/<int:id>/', views.ProductDeleteView.as_view(), name='product_delete'),
    path('api/seller/profile/products/', views.SellerProductsView.as_view(), name='seller_products'),
    path('api/seller/update/', views.SellerProfileUpdateView.as_view(), name='seller_update'),
    path('api/cart/add/', views.AddToCartView.as_view(), name='add_cart'),
    path('api/cart/', views.CheckoutView.as_view(), name='cart'),
    path('api/checkout/', views .CheckoutView.as_view()),
    path('api/cart/remove/<int:item_id>/', views.RemoveFromCartView.as_view(),name='removecart'),
    path('api/admin/products/',views.AdminProductListView.as_view(),name='admin_products'),
    path('api/admin/approve-product/<int:pk>/',views.AdminProductListView.as_view(),name='admin_products'),
    path('api/admin/delete-product/<int:pk>/',views.AdminDeleteProductView.as_view(),name='admin_products'),
    path('api/products/add/',views. AddProductView.as_view(), name='add-product'),
    path('api/orders/customer/', views.CustomerOrderHistoryView.as_view(),name='customer_orders'),
    path('api/wishlist/',views.WishlistView.as_view(), name='get_wishlist'),
    path('api/wishlist/toggle/', views.ToggleWishlistView.as_view(), name='toggle_wishlist'),
    path('api/wishlist/remove/', views.RemoveFromWishlistView.as_view(), name='remove_wishlist'),
    path('api/reviews/<int:product_id>/', views.ReviewListCreateView.as_view(), name='reviews'),
    path('api/admin/dashboard/', views.AdminDashboardView.as_view(), name='admin_dashboard'),
    path('api/admin/revenue-chart/', views.RevenueChartData.as_view(), name='revenue_chart'),
    path('api/otp/send/', views.SendOTPView.as_view(), name='send_otp'),
    path('api/otp/verify/', views.VerifyOTPView.as_view(), name='verify otp'),
 ]  

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

