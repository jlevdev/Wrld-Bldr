
from django.urls import path
from .views import RegisterView, BlacklistTokenUpdateView

app_name = 'auth'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('blacklist/', BlacklistTokenUpdateView.as_view(),
         name='blacklist')
]
