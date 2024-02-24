from django.contrib import admin
from apps import models

# Register your models here.
admin.site.register(models.Category)
admin.site.register(models.Brand)
admin.site.register(models.Warranty)
admin.site.register(models.Seller)

@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'brand', 'seller', 'offer_price']
