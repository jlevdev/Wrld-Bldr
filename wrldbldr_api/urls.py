
from django.urls import path
from .views import LocationList, SettlementList, SettlementDetail

app_name = 'wrldbldr_api'

urlpatterns = [
    path('settlement/<int:pk>/', SettlementDetail.as_view(), name='detailcreate'),
    path('settlement/', SettlementList.as_view(), name="listcreate"),
    path('location/', LocationList.as_view(), name="listcreate"),
]
