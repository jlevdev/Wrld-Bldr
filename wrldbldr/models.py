from django.db import models
from django.contrib.auth.models import User
import random
import json
from .constants import BackendConstants
from django.core.files.storage import FileSystemStorage
from django.conf import settings


class Avatar(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200, default='')
    file = models.ImageField(upload_to=settings.AVATAR_MEDIA_URL)
    race = models.CharField(max_length=200, default='')
    sex = models.CharField(max_length=1, default='f')

    def __str__(self) -> str:
        return self.name


class Background(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200, default='', unique=False)
    file = models.ImageField(upload_to=settings.BACKGROUND_MEDIA_URL)

    def __str__(self) -> str:
        return self.name


class Icon(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200,
                            default='',
                            primary_key=True,
                            unique=True)
    file = models.ImageField(upload_to=settings.ICON_MEDIA_URL)

    def __str__(self) -> str:
        return self.name


class Item(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(default='', blank=True)
    name = models.CharField(max_length=200, default='No Name Given')
    quantity = models.IntegerField(default=0)
    quantity_low = models.IntegerField(default=1)
    quantity_high = models.IntegerField(default=10)
    gold = models.IntegerField(default=0)
    silver = models.IntegerField(default=0)
    copper = models.IntegerField(default=0)
    vary_cost = models.BooleanField(default=False)
    is_service = models.BooleanField(default=False)
    is_template = models.BooleanField(default=False)
    location_type = models.ForeignKey('Location_Type',
                                      on_delete=models.PROTECT,
                                      default=None,
                                      null=True)
    location = models.ForeignKey('Location',
                                 on_delete=models.PROTECT,
                                 default=None,
                                 null=True)
    rarity = models.ForeignKey('Rarity',
                               on_delete=models.PROTECT,
                               default=None,
                               null=True)

    def __str__(self) -> str:
        return self.name


class Location_Manager(models.Manager):
    def create_shop(self,
                    settlement,
                    shop_type,
                    shop_index,
                    name='',
                    description=''):
        if name == '':
            # generate name here
            name = 'The Invulnerable Vagrant'
        shop = Location(name=name,
                        description=description,
                        location_type=shop_type,
                        settlement=settlement,
                        map_location_index=shop_index)

        shop.save()

        occupations = NPC.objects.get_staff_for(shop_type)
        npcs = []
        for o in occupations:
            npcs.append(NPC.objects.create(occupation=o, location=shop))

        inventory_size_range = {'low': 5, 'high': 7}

        inventory_size = random.randint(inventory_size_range['low'],
                                        inventory_size_range['high'])
        item_options = Item.objects.filter(
            is_template=True).order_by('?').filter(
                location_type_id=shop_type.id)[:inventory_size]

        if len(item_options) < 1:
            print(shop_type.id)
            raise Exception("no items")

        for i in item_options:
            new_item = i
            new_item.pk = None
            new_item.quantity = random.randint(new_item.quantity_low,
                                               new_item.quantity_high)
            new_item.is_template = False
            new_item.location_id = shop.id
            new_item.save()

        shop.fiscal_status = random.choice(BackendConstants.SHOP_FISCAL_STATUS)
        starting_coin_ranges = BackendConstants.SHOP_STARTING_COINS[
            shop.fiscal_status]
        shop.gold = random.randint(starting_coin_ranges[0][0],
                                   starting_coin_ranges[0][1])
        shop.silver = random.randint(starting_coin_ranges[1][0],
                                     starting_coin_ranges[1][1])
        shop.copper = random.randint(starting_coin_ranges[2][0],
                                     starting_coin_ranges[2][1])
        shop.save()

        return shop


class Location(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(default='', blank=True)
    name = models.CharField(max_length=200, default='No Name Given')
    fiscal_status = models.CharField(max_length=200, default='')
    settlement = models.ForeignKey('Settlement',
                                   on_delete=models.CASCADE,
                                   default=None,
                                   null=True)
    location_type = models.ForeignKey('Location_Type',
                                      on_delete=models.PROTECT,
                                      default=None,
                                      null=True)
    map_location_index = models.IntegerField(default=0)
    gold = models.IntegerField(default=0)
    silver = models.IntegerField(default=0)
    copper = models.IntegerField(default=0)

    objects = Location_Manager()

    def __str__(self) -> str:
        return self.name


class Location_Type(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200,
                            default='No Name Given',
                            unique=True)
    alternate_names = models.TextField(default='', blank=True)
    is_shop = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class NPC_Manager(models.Manager):
    def attachAvatar(self, race):
        avatar_options = Avatar.objects.filter(race=race)
        return random.choice(avatar_options)

    def create(self, location, occupation):
        n = NPC(occupation=occupation, location=location)
        n.race = NPC.objects.generate_race()
        n.name = NPC.objects.generate_name()
        n.avatar = NPC.objects.attachAvatar(n.race)
        n.traits = NPC.objects.generate_traits()
        n.save()
        return n

    def generate_traits(self, amount=3, randomAmount=3):
        amount = random.randint(amount, randomAmount)
        traits = []
        while amount > 0:
            newtrait = random.choice(BackendConstants.TRAITS).capitalize()
            if newtrait not in traits:
                traits.append(newtrait)
                amount = amount - 1
        return traits

    def generate_race(self):
        return random.choice(BackendConstants.RACES)

    def generate_name(self):
        return 'John Cena'

    def get_staff_for(self, location_type: Location_Type):
        staff = []
        professionals = Profession.objects.filter(
            location_type_id=location_type.id).filter(is_mandatory=True)

        expertise_levels = ['Master', 'Journeyman', 'Accomplished']
        for member in professionals:
            staff.append(random.choice(expertise_levels) + ' ' + member.name)
            if member.has_expertise is True and random.randint(1, 10) > 5:
                staff.append('Apprentice ' + member.name)

        return staff


class NPC(models.Model):
    id = models.AutoField(primary_key=True)
    avatar = models.ForeignKey('Avatar',
                               on_delete=models.PROTECT,
                               default=None,
                               null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(default='', blank=True)
    name = models.CharField(max_length=200, default='No Name Given')
    notes = models.TextField(default='', blank=True)
    occupation = models.CharField(max_length=120, default='', blank=True)
    location = models.ForeignKey('Location',
                                 on_delete=models.PROTECT,
                                 default=None,
                                 null=True)
    personality = models.CharField(max_length=120, default='', blank=True)
    race = models.CharField(max_length=120, default='', blank=True)
    spec = models.CharField(max_length=120, default='', blank=True)
    title = models.CharField(max_length=120, default='', blank=True)
    avatar = models.TextField(default='', blank=True)
    traits = models.TextField(default='', blank=True)

    objects = NPC_Manager()

    def __str__(self) -> str:
        return self.name


class Profession(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, default='', unique=True)
    has_expertise = models.BooleanField(default=False)
    is_mandatory = models.BooleanField(default=False)
    location_type = models.ForeignKey('Location_Type',
                                      on_delete=models.PROTECT,
                                      default=None,
                                      null=True)

    def __str__(self) -> str:
        return self.name


class Rarity(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, default='', unique=True)
    color = models.CharField(max_length=12, default='#000000')
    threshold = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.name


class SettlementManager(models.Manager):
    def create_with_random_shops(self, name, map_data, owner_id):
        settlement = Settlement(name=name,
                                map_data=json.dumps(map_data),
                                owner_id=owner_id)
        settlement.save()

        shops = map_data['shopIndexes']
        shop_types = []

        for s in shops:
            if len(shop_types) < 1:
                shop_types = list(
                    Location_Type.objects.filter(is_shop=True).order_by('?'))
            Location.objects.create_shop(settlement=settlement,
                                         shop_type=shop_types.pop(0),
                                         shop_index=s)

        return settlement


class Settlement(models.Model):
    id = models.AutoField(primary_key=True)
    clone_of = models.ForeignKey('Settlement',
                                 on_delete=models.DO_NOTHING,
                                 default=None,
                                 null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    """
        map_data={
                'seed': 1,
                'shopIndexes':
                [1, 2, 3, 4, 5]
            },
    """
    map_data = models.TextField(default='')
    name = models.CharField(max_length=200,
                            default='No Name Given',
                            unique=True)
    owner = models.ForeignKey('auth.User',
                              on_delete=models.CASCADE,
                              default=None,
                              null=True)
    thumbnail = models.ImageField(
        upload_to=settings.AVATAR_MEDIA_URL, null=True, default=None)
    objects = SettlementManager()

    def __str__(self) -> str:
        return self.name
