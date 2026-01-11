from rest_framework import permissions

class IsSeller(permissions.BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'seller_profile') and request.user.usertype == 'seller'
