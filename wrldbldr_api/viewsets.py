from django.db.models.query import QuerySet
from rest_framework import status
from wrldbldr.models import Settlement, Item, NPC, Location, Avatar, Icon, Background, Location_Type
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .serializers import BackgroundSerializer, IconSerializer, SettlementSerializer, ItemSerializer, LocationSerializer, NPCSerializer, AvatarSerializer
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.shortcuts import get_list_or_404


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
        return Response({"message": "No npcs found for that location"},
                        status=status.HTTP_404_NOT_FOUND)

    @action(methods=["get"], detail=True, url_path="items", url_name="items")
    def get_items(self, request, pk=None):
        q = Item.objects.filter(location_id=pk)
        if q:
            return Response(data=ItemSerializer(q, many=True).data)
        return Response({"message": "No items found for that location"},
                        status=status.HTTP_404_NOT_FOUND)


class NPCViewSet(viewsets.ModelViewSet):
    queryset = NPC.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = NPCSerializer


class SettlementViewSet(viewsets.ModelViewSet):
    queryset = Settlement.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = SettlementSerializer

    def create(self, request, *args, **kwargs):
        if not ("name" in request.data) or not ("mapData" in request.data):
            return Response(
                {"message": "settlement creation requires name and map data"},
                status=status.HTTP_400_BAD_REQUEST)

        settlement_owner = request.user.id or 1
        settlement_name = request.data["name"]
        settlement_map_data = request.data["mapData"]

        if request.data["clone"]:
            #duplicate settlement
            return Response({"message": "clone feature not implemented"},
                            status=status.HTTP_400_BAD_REQUEST)
        if Settlement.objects.filter(name=request.data["name"]):
            #some response for unique names
            return Response(
                {"message": "a settlement with this name already exists"},
                status=status.HTTP_400_BAD_REQUEST)

        ### create via model methods
        new_settlement = Settlement.objects.create_with_random_shops(
            name=settlement_name,
            map_data=settlement_map_data,
            owner_id=settlement_owner)

        r = Response(data=self.get_serializer(new_settlement).data)

        return r

    def retrieve(self, request, pk=None):
        settlement_queryset = Settlement.objects.all()
        settlement = get_object_or_404(settlement_queryset, pk=pk)

        settlement_data = SettlementSerializer(settlement).data

        #if just getting the barebones settlment object
        if "mega" not in request.data:
            return Response(settlement_data)

        mega_object = settlement_data

        location_queryset = Location.objects.all().filter(settlement__id=settlement.id)
        locations = get_list_or_404(location_queryset)

        mega_object["locations"] = LocationSerializer(locations).data

        for loc in mega_object["locations"]:
            npc_queryset = NPC.objects.all().filter(location__id=loc["id"])
            npcs = get_list_or_404(npc_queryset)
            mega_object["locations"]["id"]["npcs"] = NPCSerializer(npcs).data

            item_queryset = Item.objects.all().filter(location__id=loc["id"])
            items = get_list_or_404(item_queryset)
            mega_object["locations"]["id"]["items"] = ItemSerializer(items).data

        return Response(mega_object)