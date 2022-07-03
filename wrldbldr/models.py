from django.db import models
from django.contrib.auth.models import User


class Location(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(default='', blank=True)
    name = models.CharField(max_length=200, default='No Name Given')
    settlement = models.ForeignKey('Settlement',
                                   on_delete=models.CASCADE,
                                   default=None,
                                   null=True)


class Settlement(models.Model):
    class SettlementManager(models.Manager):
        def create_settlement(self, name, map_data='', user_id=1):
            s = Settlement(name=name, map_data='', owner_id=1)
            s.save()

            l = Location(name=name+" Location", description="", settlement=s)
            l.save()

            return s

    id = models.AutoField(primary_key=True)
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

    objects = SettlementManager()

    def __str__(self) -> str:
        return self.name
