from copy import copy

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import APIException
from rest_framework.response import Response

from wrldbldr.models import (
    NPC,
    Avatar,
    Background,
    Icon,
    Item,
    Location,
    Location_Type,
    Settlement,
)

from .serializers import (
    AvatarSerializer,
    BackgroundSerializer,
    IconSerializer,
    ItemSerializer,
    LocationSerializer,
    NPCSerializer,
    SettlementSerializer,
)


class AvatarViewSet(viewsets.ModelViewSet):
    queryset = Avatar.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = AvatarSerializer


class BackgroundViewSet(viewsets.ModelViewSet):
    queryset = Background.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = BackgroundSerializer


class IconViewSet(viewsets.ModelViewSet):
    queryset = Icon.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = IconSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ItemSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = LocationSerializer

    @action(methods=["get"], detail=True, url_path="npcs", url_name="npcs")
    def get_npcs(self, request, pk=None):
        q = NPC.objects.filter(location_id=pk)
        if q:
            return Response(data=NPCSerializer(q, many=True).data)
        return Response(
            {"message": "No npcs found for that location"},
            status=status.HTTP_404_NOT_FOUND,
        )


class NPCViewSet(viewsets.ModelViewSet):
    queryset = NPC.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = NPCSerializer


class SettlementViewSet(viewsets.ModelViewSet):
    queryset = Settlement.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = SettlementSerializer
    # asfas

    def create(self, request, *args, **kwargs):
        if not ("name" in request.data) or not ("mapData" in request.data):
            return Response(
                {"message": "settlement creation requires name and map data"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        settlement_owner = request.user.id or 1
        settlement_name = request.data["name"]
        settlement_map_data = request.data["mapData"]

        if "clone" in request.data:
            # duplicate settlement
            return Response(
                {"message": "clone feature not implemented"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if Settlement.objects.filter(name=request.data["name"]):
            # some response for unique names
            return Response(
                {"message": "a settlement with this name already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # create via model methods
        new_settlement = Settlement.objects.create_with_random_shops(
            name=settlement_name,
            map_data=settlement_map_data,
            owner_id=settlement_owner,
        )

        mega_object = self.generate_mega_object(new_settlement.id)

        return Response(data=mega_object)

    def generate_mega_object(self, pk):
        sq = Settlement.objects.all().get(pk=pk)
        mega_object = SettlementSerializer(sq).data

        lq = Location.objects.filter(settlement_id=pk)

        mega_object["locations"] = []
        mega_object["icons"] = {}

        locations = LocationSerializer(lq, many=True).data

        for loc in locations:
            temp = copy(loc)

            npcs = NPC.objects.filter(location_id=loc["id"])
            temp["npcs"] = NPCSerializer(npcs, many=True).data

            items = Item.objects.all().filter(location_id=loc["id"])
            temp["items"] = ItemSerializer(items, many=True).data

            mega_object["locations"].append(temp)

            iconName = str(loc["location_type"]["name"]).lower()
            icon = Icon.objects.get(pk=iconName)
            mega_object["icons"][iconName] = IconSerializer(icon).data

        return mega_object

    @action(methods=["get"], detail=True, url_path="mega", url_name="mega")
    def get_mega_object(self, request, pk=None):
        mega_object = self.generate_mega_object(pk)
        return Response(mega_object)
