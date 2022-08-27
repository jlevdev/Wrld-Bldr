from rest_framework import serializers
from wrldbldr.models import Settlement, Location


class SettlementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settlement
        fields = ('id', 'name', 'map_data', 'owner')


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('id', 'name', 'settlement', 'description')
