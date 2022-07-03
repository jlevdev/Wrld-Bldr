from rest_framework import generics
from wrldbldr.models import Settlement, Location
from .serializers import LocationSerializer, SettlementSerializer
from rest_framework.response import Response
from rest_framework import status


class SettlementList(generics.ListCreateAPIView):
    queryset = Settlement.objects.all()
    serializer_class = SettlementSerializer

    def create(self, request):
        s = Settlement.objects.create_settlement(name=request.data['name'])

        if s:
            return Response(status=status.HTTP_201_CREATED, data=self.get_serializer(s).data)

        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LocationList(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class SettlementDetail(generics.RetrieveAPIView):
    queryset = Settlement.objects.all()
    serializer_class = SettlementSerializer
