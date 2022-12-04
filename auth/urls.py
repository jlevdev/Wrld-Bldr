from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    BlacklistTokenUpdateView,
    MyTokenObtainPairView,
    RegisterView,
    UserView,
)

app_name = "auth"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth_register"),
    path("blacklist/", BlacklistTokenUpdateView.as_view(), name="blacklist"),
    path("user/<pk>/", UserView.as_view(), name="user"),
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
