from rest_framework import serializers
from .models import (
    User, Customer, Seller,
    Product, Order, OrderItem,
    Cart, CartItem,Review, 
)

# ---------------- USER ---------------- #

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'password', 'email', 'usertype',
            'address', 'phone_number', 'first_name', 'last_name','is_verified'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


# ---------------- CUSTOMER ---------------- #

class CustomerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    customer_id = serializers.CharField(
        source='customer_profile.customer_id',
        read_only=True
    )
    

    class Meta:
        model = User
        fields = [
            'id', 'username', 'customer_id',
            'first_name', 'last_name',
            'email', 'password',
            'address', 'phone_number','is_verified'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User(**validated_data, usertype='customer')
        user.set_password(password)
        user.save()

        Customer.objects.create(user=user)
        Cart.objects.create(user=user)   

        return user


# ---------------- SELLER ---------------- #

class SellerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email')
    phone_number = serializers.CharField(source='user.phone_number')
    address = serializers.CharField(source='user.address', required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Seller
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'email', 'phone_number', 'address', 'password',
            'shop_name', 'gst_number', 'is_approved'
        ]

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password')

        user = User.objects.create(**user_data, usertype='seller')
        user.set_password(password)
        user.save()

        return Seller.objects.create(user=user, **validated_data)


class SellerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone_number']


# ---------------- PRODUCT ---------------- #

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    seller = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'seller', 'name', 'short_description',
            'price', 'stock', 'image',
            'is_active', 'created_at'
        ]

    def create(self, validated_data):
        request = self.context['request']
        validated_data['seller'] = request.user.seller_profile
        
        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image and request:
            data['image'] = request.build_absolute_uri(instance.image.url)
        return data

# ---------------- CART ---------------- #

class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(
        source='product.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    product_image = serializers.SerializerMethodField()
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'product_id', 'product_name',
            'product_price', 'product_image',
            'quantity', 'line_total'
        ]

    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            return request.build_absolute_uri(obj.product.image.url)
        return None

    def get_line_total(self, obj):
        return obj.product.price * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_amount']

    def get_total_amount(self, obj):
        return sum(i.product.price * i.quantity for i in obj.items.all())


# ---------------- ORDER ---------------- #

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    seller_name = serializers.CharField(source='product.seller.shop_name', read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product_name',
            'seller_name',
            'quantity',
            'unit_price'
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'customer_name',
            'total_amount',
            'status',
            'created_at',
            'shipping_address',
            'items'
        ]

# ---------------- review ---------------- #

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id',
            'user_name',
            'rating',
            'comment',
            'created_at'
        ]