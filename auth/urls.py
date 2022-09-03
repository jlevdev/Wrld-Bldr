
from django.urls import path
from .views import RegisterView, BlacklistTokenUpdateView, UserView

app_name = 'auth'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('blacklist/', BlacklistTokenUpdateView.as_view(),
         name='blacklist'),
    path('user/<pk>/', UserView.as_view(),
         name='user'),

] 
