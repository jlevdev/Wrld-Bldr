
from django.urls import path
from .views import RegisterView

app_name = 'register'

urlpatterns = [
    path('', RegisterView.as_view(), name='auth_register'),
]
