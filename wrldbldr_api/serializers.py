from rest_framework import serializers
from wrldbldr.models import Settlement, Item, NPC, User, Location, Avatar, Icon, Background


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'
        depth = 1


class NPCSerializer(serializers.ModelSerializer):
    class Meta:
        model = NPC
        fields = '__all__'


class SettlementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settlement
        fields = '__all__'

class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fields = '__all__'


class BackgroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Background
        fields = '__all__'


class IconSerializer(serializers.ModelSerializer):
    class Meta:
        model = Icon
        fields = '__all__'