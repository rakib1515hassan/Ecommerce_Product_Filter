from django.shortcuts import render
from django.views import generic, View
from django.db.models import Prefetch, Count, Q, F

from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from apps import models
from apps import serializers

# Create your views here.
class Home(generic.TemplateView):
    template_name = 'index.html'


class CategoryView(generics.ListCreateAPIView, generics.RetrieveUpdateAPIView):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer

    lookup_field = "id"


class BrandView(generics.ListCreateAPIView, generics.RetrieveUpdateAPIView):
    queryset = models.Brand.objects.all()
    serializer_class = serializers.BrandSerializer
    lookup_field = "id"


class WarrantyView(generics.ListCreateAPIView, generics.RetrieveUpdateAPIView):
    queryset = models.Warranty.objects.all()
    serializer_class = serializers.WarrantySerializer

    lookup_field = "id"


class SellerView(generics.ListCreateAPIView, generics.RetrieveUpdateAPIView):
    queryset = models.Seller.objects.all()
    serializer_class = serializers.SellerSerializer
    lookup_field = "id"



class ProductList(generics.ListAPIView):
    serializer_class = serializers.ProductSerializer
    filter_backends  = [DjangoFilterBackend, OrderingFilter]

    filterset_fields = {
        'category': ['in'],  
        'brand'   : ['in'],
        'warranty': ['in'],
        'seller'  : ['in'],
        'price'   : ['gte', 'lte'],
    }
    
    def get_queryset(self):
        queryset = models.Product.objects.all().select_related(
            'category',
            'brand',
            'warranty',
            'seller',

        ).prefetch_related(
            Prefetch('category', queryset=models.Category.objects.annotate(num_products=Count('product_category'))),
            Prefetch('brand',    queryset=models.Brand.objects.annotate(num_products=Count('product_brand'))),
            Prefetch('warranty', queryset=models.Warranty.objects.annotate(num_products=Count('product_warranty'))),
            Prefetch('seller',   queryset=models.Seller.objects.annotate(num_products=Count('product_seller')))
        )
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    

    




