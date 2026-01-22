# Django
from django.contrib.auth import authenticate
from django.db import transaction
from django.db.models import Q
from django.shortcuts import render, get_object_or_404
from django.views import View
from django.views.generic import TemplateView
from rest_framework import status, viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import SearchFilter
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Customer, Seller, Product, Cart, CartItem, Order, OrderItem
from .serializers import CustomerSerializer, SellerSerializer, SellerUpdateSerializer, ProductSerializer, OrderSerializer
from .permissions import IsSeller
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class RegisterCustomer(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"message": "Customer registered successfully",
                             "token": token.key}, status=201)
        return Response(serializer.errors, status=400)




class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        token, _ = Token.objects.get_or_create(user=user)

        response_data = {
            "token": token.key,
            "username": user.username,
            "email": user.email,
            "usertype": user.usertype,
            "is_superuser": user.is_superuser,
        }

        if user.is_superuser:
            response_data["role"] = "admin"
            response_data["message"] = "Admin login successful"

        elif user.usertype == "customer":
            try:
                customer = Customer.objects.get(user=user)
                response_data.update({
                    "customer_id": customer.customer_id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone": getattr(user, "phone_number", None),
                    "address": getattr(user, "address", None),
                })
            except Customer.DoesNotExist:
                return Response({"error": "Customer profile not found"}, status=404)

        elif user.usertype == "seller":
            try:
                seller = Seller.objects.get(user=user)
                response_data.update({
                    "seller_id": seller.id,
                    "shop_name": seller.shop_name,
                    "gst_number": seller.gst_number,
                    "is_approved": seller.is_approved,
                })
            except Seller.DoesNotExist:
                return Response({"error": "Seller profile not found"}, status=404)

        else:
            return Response({"error": "Invalid user type"}, status=400)

        return Response(response_data, status=200)


class CustomerProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        customer = Customer.objects.get(user=request.user)
        serializer = CustomerSerializer(request.user)
        return Response(serializer.data)


class CustomerProfileUpdateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = CustomerSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class AdminCustomerListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)

        customers = User.objects.filter(usertype='customer')
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)
    
class AdminSellerListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)

        sellers = Seller.objects.select_related('user').all()
        serializer = SellerSerializer(sellers, many=True)
        return Response(serializer.data)
    
class ApproveSellerView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        try:
            seller = Seller.objects.get(id=id)
            seller.is_approved = True
            seller.save()
            return Response({"message": "Seller approved successfully"})
        except Seller.DoesNotExist:
            return Response({"error": "Seller not found"}, status=404)
        
class DeleteSellerView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        try:
            seller = Seller.objects.get(id=id)
            seller.user.delete()  
            return Response({"message": "Seller deleted successfully"})
        except Seller.DoesNotExist:
            return Response({"error": "Seller not found"}, status=404)
        

class DeleteCustomerAdminView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        try:
            customer_user = User.objects.get(pk=pk, usertype='customer')
            customer_user.delete()  
            return Response({"message": "Customer deleted successfully"})
        except User.DoesNotExist:
            return Response({"error": "Customer not found"}, status=404)
        
class RegisterSeller(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SellerSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user.user)
            return Response({"message": "Seller registered successfully",
                             "token": token.key}, status=201)
        print(serializer.errors)  

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class sellerprofileview(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]  
    def get(self, request):
       
        seller = Seller.objects.get(user=request.user)
        serializer = SellerSerializer(seller)
        return Response(serializer.data)
    


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
            )

        return queryset
    
    def perform_create(self, serializer):
      user = self.request.user

      if not hasattr(user, 'seller'):
        raise PermissionDenied("Only sellers can add products")

      serializer.save(seller=user.seller)



class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'customer_profile'):
            return Order.objects.filter(user=self.request.user)
        return Order.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(self.get_serializer(order).data, status=status.HTTP_201_CREATED)
    


class ProductEditView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  

    def get(self, request, id):
        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        serializer = ProductSerializer(
            product,
            context={'request': request}  
        )
        return Response(serializer.data)

    def put(self, request, id):
        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        serializer = ProductSerializer(
            product,
            data=request.data,              
            partial=True,                   
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class ProductDeleteView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsSeller]

    def delete(self, request, id):
        try:
            product = Product.objects.get(id=id, seller=request.user.seller_profile)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        product.delete()
        return Response({"message": "Product deleted successfully"})
    

class SellerProductsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsSeller]

    def get(self, request):
        products = Product.objects.filter(seller=request.user.seller_profile)
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
    

class SellerProfileUpdateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsSeller]

    def put(self, request):
        try:
            seller = Seller.objects.get( user=request.user)
        except Seller.DoesNotExist:
            return Response({"error": "Seller not found"}, status=404)
        user = seller.user
        serializer = SellerUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=400)  
    

class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)

        items = []
        total = 0

        for item in cart.items.select_related('product'):
            subtotal = item.product.price * item.quantity
            total += subtotal
            items.append({
                "id": item.id,
                "product": item.product.name,
                "price": item.product.price,
                "quantity": item.quantity,
                "subtotal": subtotal
            })

        return Response({
            "items": items,
            "total": total
        })

    @transaction.atomic
    def post(self, request):
        cart = Cart.objects.filter(user=request.user).first()

        if not cart or not cart.items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total = 0

        order = Order.objects.create(
            user=request.user,
            total_amount=0,
            shipping_address=getattr(request.user, "address", "")
        )

        for item in cart.items.select_related('product'):
            product = item.product

            if product.stock < item.quantity:
                return Response(
                    {"error": f"{product.name} out of stock"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            product.stock -= item.quantity
            product.save()

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item.quantity,
                unit_price=product.price
            )

            total += product.price * item.quantity

        order.total_amount = total
        order.save()
        cart.items.all().delete()

        return Response(
            {
                "message": "Order placed successfully",
                "order_id": order.id,
                "total_amount": total
            },
            status=status.HTTP_201_CREATED
        )

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )

        if not created:
            cart_item.quantity += quantity
        cart_item.save()

        return Response(
            {"message": "Item added to cart"},
            status=status.HTTP_200_OK
        )


class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user
            )
            cart_item.delete()
            return Response(
                {"message": "Item removed from cart"},
                status=status.HTTP_200_OK
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminProductListView(ListAPIView):
    serializer_class = ProductSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]


    def post(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        product.is_active = True
        product.save()

        return Response(
            {"message": "Product approved successfully"},
            status=200
        )

    def get_queryset(self):
        return Product.objects.all()
    
   
class AdminDeleteProductView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        product.delete()

        return Response(
            {"message": "Product deleted successfully"},
            status=200
        )

class AddProductView(APIView):
    permission_classes = [IsAuthenticated, IsSeller]

    def post(self, request):
        seller = request.user.seller_profile   

        serializer = ProductSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save(seller=seller)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

class CustomerOrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.info(f"CustomerOrderHistoryView called for user: {request.user}")
        try:
            orders = Order.objects.filter(user=request.user).order_by('-created_at')
            if not orders.exists():
                return Response({"message": "No orders found for this user."}, status=200)
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in CustomerOrderHistoryView: {e}")
            return Response({"error": "Could not fetch order history."}, status=500)
