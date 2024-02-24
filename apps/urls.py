from django.urls import path
from apps import views

urlpatterns = [
    path('', views.Home.as_view(), name='home'),

    # API
    path("category/", views.CategoryView.as_view(), name="category"),
    path("brand/", views.BrandView.as_view(), name="brand"),
    path("warranty/", views.WarrantyView.as_view(), name="warranty"),
    path("seller/", views.SellerView.as_view(), name="seller"),
    path("seller/", views.SellerView.as_view(), name="seller"),

    path("product/", views.ProductList.as_view(), name="product"),

] 
