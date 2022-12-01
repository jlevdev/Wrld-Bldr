from wrldbldr.models import Item, Rarity, Location_Type, Profession
from .default_inventories import Default_Inventories
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Generates an initial inventory for the wrldbldr database"

    def convert_string_to_currency(self, s):
        currency_type = s[-2:]
        amount = s[:-2]
        if currency_type == "gp":
            return [amount, 0, 0]
        elif currency_type == "sp":
            return [0, amount, 0]
        elif currency_type == "cp":
            return [0, 0, amount]
        raise Exception("not a recognized currency")

    def handle(self, *args, **options):
        for r in Default_Inventories.default_rarities:
            new_rarity = Rarity(
                name=r["name"], color=r["color"], threshold=r["threshold"]
            )
            new_rarity.save()

        location_type_map = {}

        for loc_type, profs in Default_Inventories.default_location_types.items():
            lt = Location_Type(name=loc_type)
            lt.save()
            location_type_map[loc_type] = lt
            for n in profs:
                p = Profession(
                    name=n,
                    location_type=lt,
                    has_expertise=n["expertise"],
                    is_mandatory=n["mandatory"],
                )
                p.save()
        print(location_type_map)

        def populate(inventory):

            lt_key = inventory.pop(0)
            print(location_type_map[lt_key].id)

            for i in inventory:
                currency = self.convert_string_to_currency(i["cost"])
                new_item = Item(
                    name=i["name"],
                    gold=currency[0],
                    silver=currency[1],
                    copper=currency[2],
                    description=i["desc"],
                    is_template=True,
                    location_type_id=location_type_map[lt_key].id,
                )
                new_item.save()

        populate(Default_Inventories.ALCHEMIST_ITEMS)
        populate(Default_Inventories.BREWMASTER_ITEMS)
        populate(Default_Inventories.CALLIGRAPHER_ITEMS)
        populate(Default_Inventories.CARPENTER_ITEMS)
        populate(Default_Inventories.CARTOGRAPHER_ITEMS)
        populate(Default_Inventories.COBBLER_ITEMS)
        populate(Default_Inventories.GENERAL_STORE_ITEMS)
        populate(Default_Inventories.GLASSBLOWER_ITEMS)
        populate(Default_Inventories.INNKEEPER_ITEMS)
        populate(Default_Inventories.JEWLER_ITEMS)
        populate(Default_Inventories.LEATHERWORKER_ITEMS)
        populate(Default_Inventories.MASON_ITEMS)
        populate(Default_Inventories.MAGIC_SHOP_ITEMS)
        populate(Default_Inventories.PAINTER_ITEMS)
        populate(Default_Inventories.POTTER_ITEMS)
        populate(Default_Inventories.BLACKSMITH_ITEMS)
        populate(Default_Inventories.TINKERER_ITEMS)
        populate(Default_Inventories.WEAVER_ITEMS)
        populate(Default_Inventories.WOODCARVER_ITEMS)

        self.stdout.write(self.style.SUCCESS("Successfully created inventory"))
