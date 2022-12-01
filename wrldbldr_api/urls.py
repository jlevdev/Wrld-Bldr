from rest_framework import routers
from .viewsets import (
    SettlementViewSet,
    ItemViewSet,
    LocationViewSet,
    NPCViewSet,
    AvatarViewSet,
    IconViewSet,
    BackgroundViewSet,
)

router = routers.DefaultRouter()
router.register("item", ItemViewSet, "item")
router.register("location", LocationViewSet, "location")
router.register("npc", NPCViewSet, "npc")
router.register("settlement", SettlementViewSet, "settlement")
router.register("avatar", AvatarViewSet, "avatar")
router.register("background", BackgroundViewSet, "background")
router.register("icon", IconViewSet, "icon")

urlpatterns = router.urls
