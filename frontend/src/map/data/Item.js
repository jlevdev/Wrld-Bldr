import Random from "../utils/Random";

export default class Item {

    //no rarity is common rarity
    static RARITY_MAP = {
        'uncommon': {
            'threshold': 8,
            'color': '#15d649'
        },
        'rare': {
            'threshold': 5,
            'color': '#1b2ede'
        },
        'epic': {
            'threshold': 3,
            'color': '#8b14db'
        },
        'legendary': {
            'threshold': 1,
            'color': '#d1a71d'
        },
    }

    static SERVICE_TYPE = 'service';
    static VARY_COST_TYPE = 'vary_cost';
    static searchableItems = null;
    static itemLookup = null;

    //begin giant fucking inventory lists

    static ALCHEMIST_ITEMS = [
        {
            'name': 'Minor healing potion',
            'cost': '50gp',
            'desc': 'A minor healing potion'
        }, {
            "name": "Potion of healing",
            "cost": "50gp",
            "desc": ""
        },
        {
            'name': 'Greater healing potion',
            'cost': '200gp',
            'desc': 'A greater healing potion',
            'rarity': Item.RARITY_MAP['rare']
        }, {
            "name": "Alchemist's fire (flask)",
            "cost": "50gp",
            "desc": ""
        }, {
            "name": "Antitoxin (vial)",
            "cost": "50gp",
            "desc": ""
        }, {
            "name": "Healer's kit",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Oil (flask)",
            "cost": "1sp",
            "desc": ""
        }, {
            "name": "Perfume (vial)",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Poison, basic (vial)",
            "cost": "100gp",
            "desc": ""
        }, {
            "name": "Vial",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Alchemist's Supplies",
            "cost": "50gp",
            "desc": ""
        }, {
            "name": "Herbalism kit",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Poisoner's kit",
            "cost": "50gp",
            "desc": ""
        }
    ]


    static BLACKSMITH_ITEMS = [
        {
            'name': 'Breastplate',
            'cost': '400gp',
            'desc': ''
        },
        {
            'name': 'Chain Shirt',
            'cost': '50gp',
            'desc': ''
        },
        {
            'name': 'Plate Armor',
            'cost': '1500gp',
            'desc': ''
        },
        {
            'name': 'Half Plate Armor',
            'cost': '750gp',
            'desc': ''
        },
        {
            'name': 'Scale Mail Armor',
            'cost': '50gp',
            'desc': ''
        },
        {
            'name': 'Ring Mail Armor',
            'cost': '30gp',
            'desc': ''
        },
        {
            'name': 'Chain Mail Armor',
            'cost': '50gp',
            'desc': ''
        },
        {
            'name': 'Splint Armor',
            'cost': '50gp',
            'desc': ''
        },
        {
            'name': 'Shield',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Dagger',
            'cost': '2sp',
            'desc': ''
        },
        {
            'name': 'Greatclub',
            'cost': '1sp',
            'desc': ''
        },
        {
            'name': 'Handaxe',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'Javelin',
            'cost': '5sp',
            'desc': ''
        },
        {
            'name': 'Light Hammer',
            'cost': '2gp',
            'desc': ''
        },
        {
            'name': 'Mace',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'Quarterstaff',
            'cost': '2sp',
            'desc': ''
        },
        {
            'name': 'Sickle',
            'cost': '1gp',
            'desc': ''
        },
        {
            'name': 'Spear',
            'cost': '1gp',
            'desc': ''
        },
        {
            'name': 'Crossbow, light',
            'cost': '25gp',
            'desc': ''
        },
        {
            'name': 'Dart',
            'cost': '5cp',
            'desc': ''
        },
        {
            'name': 'Sling',
            'cost': '1sp',
            'desc': ''
        },
        {
            'name': 'Battleaxe',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Flail',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Glaive',
            'cost': '20gp',
            'desc': ''
        },
        {
            'name': 'Greataxe',
            'cost': '30gp',
            'desc': ''
        },
        {
            'name': 'Greatsword',
            'cost': '50gp',
            'desc': ''
        },
        {
            'name': 'Halberd',
            'cost': '20gp',
            'desc': ''
        },
        {
            'name': 'Lance',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Longsword',
            'cost': '15gp',
            'desc': ''
        },
        {
            'name': 'Maul',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Morningstar',
            'cost': '15gp',
            'desc': ''
        },
        {
            'name': 'Pike',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'Rapier',
            'cost': '25gp',
            'desc': ''
        },
        {
            'name': 'Scimitar',
            'cost': '25gp',
            'desc': ''
        },
        {
            'name': 'Shortsword',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Trident',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'War Pick',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'Warhammer',
            'cost': '15gp',
            'desc': ''
        }, {
            "name": "Ball bearings (bag of 1,000)",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Barrel",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Bell",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Chain (10 feet)",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Chest",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Climber's kit",
            "cost": "25gp",
            "desc": ""
        }, {
            "name": "Crowbar",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Flask or tankard",
            "cost": "2cp",
            "desc": ""
        }, {
            "name": "Grappling hook",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Hammer",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Hammer, sledge",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Hunting trap",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Lamp",
            "cost": "5sp",
            "desc": ""
        }, {
            "name": "Lantern, bullseye",
            "cost": "10gp",
            "desc": ""
        }, {
            "name": "Lantern, hooded",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Lock",
            "cost": "10gp",
            "desc": ""
        }, {
            "name": "Manacles",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Pick, miner's",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Piton",
            "cost": "5cp",
            "desc": ""
        }, {
            "name": "Pot, iron",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Scale, merchant's",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Shovel",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Signal whistle",
            "cost": "5cp",
            "desc": ""
        }, {
            "name": "Spikes, iron (10)",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Whetstone",
            "cost": "1cp",
            "desc": ""
        }, {
            "name": "Smith's Tools",
            "cost": "20gp",
            "desc": ""
        }
    ]

    static BREWMASTER_ITEMS = [
        {
            'name': 'Weak ale',
            'cost': '2cp',
            'desc': ''
        },
        {
            'name': 'Strong ale',
            'cost': '5cp',
            'desc': ''
        },
        {
            'name': 'Barrel of top notch ale',
            'cost': '2gp',
            'desc': ''
        }, {
            "name": "Brewer's Supplies",
            "cost": "20gp",
            "desc": ""
        },
        {
            'name': 'Ale (gallon)',
            'cost': '2sp',
            'desc': ''
        },
        {
            'name': 'Ale (mug)',
            'cost': '4cp',
            'desc': ''
        },
        {
            'name': 'Wine, common (pitcher)',
            'cost': '2sp',
            'desc': ''
        },
        {
            'name': 'Wine, fine (bottle)',
            'cost': '10gp',
            'desc': ''
        }
    ]

    static BOOK_SHOP_ITEMS = [
        {
            "name": "Book",
            "cost": "25gp",
            "desc": ""
        }, {
            "name": "Ink (1 ounce bottle)",
            "cost": "10gp",
            "desc": ""
        }, {
            "name": "Ink pen",
            "cost": "2cp",
            "desc": ""
        }, {
            "name": "Paper (onesheet)",
            "cost": "2sp",
            "desc": ""
        }, {
            "name": "Parchment (onesheet)",
            "cost": "1sp",
            "desc": ""
        }
    ]

    static CALLIGRAPHER_ITEMS = [
        {
            'name': 'Ink(1 ounce bottle)',
            'cost': '10gp',
            'desc': 'A bottle of ink.'
        },
        {
            'name': 'Ink pen',
            'cost': '2cp',
            'desc': 'An ink pen.'
        },
        {
            'name': 'Sheet of paper',
            'cost': '2sp',
            'desc': ''
        }, {
            "name": "Calligrapher's Supplies",
            "cost": "10gp",
            "desc": ""
        }
    ]

    static CARPENTER_ITEMS = [
        {
            'name': 'Carpenter\'s tools',
            'cost': '8gp',
            'desc': ''
        },
        {
            'name': 'Dice set',
            'cost': '1sp',
            'desc': ''
        },
        {
            'name': 'Dragonchess set',
            'cost': '1gp',
            'desc': ''
        }
    ]

    static CARTOGRAPHER_ITEMS = [
        {
            'name': 'Map of the region',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Map of the continent',
            'cost': '50gp',
            'desc': ''
        },
        {
            'name': 'Treasure map',
            'cost': '5gp',
            'desc': ''
        }, {
            "name": "Cartgorapher's Tools",
            "cost": "15gp",
            "desc": ""
        }
    ]

    static COBBLER_ITEMS = [
        {
            'name': 'Shoes',
            'cost': '2gp',
            'desc': 'Decent shoes'
        },
        {
            'name': 'Fancy shoes',
            'cost': '10gp',
            'desc': 'Some very nice shoes'
        },
        {
            'name': 'Survivalist boots',
            'cost': '10gp',
            'desc': ''
        }, {
            "name": "Cobbler's Tools",
            "cost": "5gp",
            "desc": ""
        }
    ]

    static INNKEEPER_ITEMS = [
        {
            'name': 'Ale',
            'cost': '3cp',
            'desc': ''
        },
        {
            'name': 'Dinner special',
            'cost': '1sp',
            'desc': ''
        },
        {
            'name': 'Ale (gallon)',
            'cost': '2sp',
            'desc': ''
        },
        {
            'name': 'Ale (mug)',
            'cost': '4cp',
            'desc': ''
        },
        {
            'name': 'Wine, common (pitcher)',
            'cost': '2sp',
            'desc': ''
        },
        {
            'name': 'Wine, fine (bottle)',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Banquet (per person)',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Bread loaf',
            'cost': '2cp',
            'desc': ''
        },
        {
            'name': 'Cheese, hunk',
            'cost': '1sp',
            'desc': ''
        },
        {
            'name': 'Meat, chunk',
            'cost': '3sp',
            'desc': '',
        }
    ]

    static GENERAL_STORE_ITEMS = [
        {
            "name": "Candle",
            "cost": "1cp",
            "desc": ""
        }, {
            "name": "Chalk (1 piece)",
            "cost": "1cp",
            "desc": ""
        }, {
            "name": "Fishing tackle",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Block and tackle",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Healer's kit",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Hourglass",
            "cost": "25gp",
            "desc": ""
        }, {
            "name": "Ink (1 ounce bottle)",
            "cost": "10gp",
            "desc": ""
        }, {
            "name": "Ink pen",
            "cost": "2cp",
            "desc": ""
        }, {
            "name": "Lamp",
            "cost": "5sp",
            "desc": ""
        }, {
            "name": "Lantern, bullseye",
            "cost": "10gp",
            "desc": ""
        }, {
            "name": "Lantern, hooded",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Mess kit",
            "cost": "2sp",
            "desc": ""
        }, {
            "name": "Paper (onesheet)",
            "cost": "2sp",
            "desc": ""
        }, {
            "name": "Parchment (onesheet)",
            "cost": "1sp",
            "desc": ""
        }, {
            "name": "Rations (1day)",
            "cost": "5sp",
            "desc": ""
        }, {
            "name": "Sealing wax",
            "cost": "5sp",
            "desc": ""
        }, {
            "name": "Signet ring",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Soap",
            "cost": "2cp",
            "desc": ""
        }, {
            "name": "Tent, two-person",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Tinderbox",
            "cost": "5sp",
            "desc": ""
        }, {
            "name": "Torch",
            "cost": "1cp",
            "desc": ""
        }, {
            "name": "Vial",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Waterskin",
            "cost": "2sp",
            "desc": ""
        }, {
            "name": "Burglar's Pack",
            "cost": "16gp",
            "desc": ""
        }, {
            "name": "Diplomat's Pack",
            "cost": "39gp",
            "desc": ""
        }, {
            "name": "Dungeoneer's Pack",
            "cost": "12gp",
            "desc": ""
        }, {
            "name": "Entertainer's Pack",
            "cost": "40gp",
            "desc": ""
        }, {
            "name": "Explorer's Pack",
            "cost": "10gp",
            "desc": ""
        }, {
            "name": "Priest's Pack",
            "cost": "19gp",
            "desc": ""
        }, {
            "name": "Scholar's Pack",
            "cost": "40gp",
            "desc": ""
        },
        {
            'name': 'Dice set',
            'cost': '1sp',
            'desc': ''
        },
        {
            'name': 'Dragonchess set',
            'cost': '1gp',
            'desc': ''
        },
        {
            'name': 'Playing card set',
            'cost': '5sp',
            'desc': ''
        },
        {
            'name': 'Three-Dragon Ante set',
            'cost': '1gp',
            'desc': ''
        },
        {
            'name': 'Navigator\'s tools',
            'cost': '25gp',
            'desc': ''
        }
    ]

    static GLASSBLOWER_ITEMS = [
        {
            'name': 'Flask',
            'cost': '1sp',
            'desc': ''
        },
        {
            'name': 'Vial',
            'cost': '5cp',
            'desc': ''
        },
        {
            'name': 'Mirror',
            'cost': '5gp',
            'desc': ''
        }, {
            "name": "Bottle, glass",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Hourglass",
            "cost": "25gp",
            "desc": ""
        }, {
            "name": "Lamp",
            "cost": "5sp",
            "desc": ""
        }, {
            "name": "Lantern, bullseye",
            "cost": "10gp",
            "desc": ""
        }, {
            "name": "Lantern, hooded",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Magnifying glass",
            "cost": "100gp",
            "desc": ""
        }, {
            "name": "Mirror, steel",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Spyglass",
            "cost": "1,000gp",
            "desc": ""
        }, {
            "name": "Glassblower's Tools",
            "cost": "30gp",
            "desc": ""
        }
    ]

    static JEWLER_ITEMS = [
        {
            'name': 'Signet ringp',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'Amulet',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Ear rings',
            'cost': '5gp',
            'desc': ''
        }, {
            "name": "Signet ring",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Jewler's Tools",
            "cost": "25gp",
            "desc": ""
        }
    ]

    static LEATHERWORKER_ITEMS = [
        {
            'name': 'Padded armor',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'Leather armor',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Studed Leather armor',
            'cost': '45gp',
            'desc': ''
        },
        {
            'name': 'Hide armor',
            'cost': '40gp',
            'desc': ''
        },
        {
            'name': 'Sling',
            'cost': '1sp',
            'desc': ''
        },
        {
            'name': 'Sling Bullets (20)',
            'cost': '4cp',
            'desc': ''
        }, {
            "name": "Backpack",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Case, map or scroll",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Pouch",
            "cost": "5sp",
            "desc": ""
        }, {
            "name": "Quiver",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Tent, two-person",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Waterskin",
            "cost": "2sp",
            "desc": ""
        }, {
            "name": "Leatherwork's Tools",
            "cost": "5gp",
            "desc": ""
        }
    ]

    static MAGIC_SHOP_ITEMS = [
        {
            'name': 'Crystal',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Orb',
            'cost': '20gp',
            'desc': ''
        },
        {
            'name': 'Rod',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Staff',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'Wand',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Sprig of Mistletoe',
            'cost': '1gp',
            'desc': ''
        },
        {
            'name': 'Totem',
            'cost': '1gp',
            'desc': ''
        },
        {
            'name': 'Wooden Staff',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'Yew Wand',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Amulet',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'Emblem',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'Reliquary',
            'cost': '5gp',
            'desc': ''
        }, {
            "name": "Component pouch",
            "cost": "25gp",
            "desc": ""
        }, {
            "name": "Holywater (flask)",
            "cost": "25gp",
            "desc": ""
        }, {
            "name": "Spell book",
            "cost": "50gp",
            "desc": ""
        }
    ]

    static MASON_ITEMS = [
        {
            'name': 'Statue',
            'cost': '50gp',
            'desc': ''
        },
        {
            'name': 'Large status',
            'cost': '500gp',
            'desc': ''
        }, {
            "name": "Mason's Tools",
            "cost": "10gp",
            "desc": ""
        }
    ]

    static MUSIC_SHOP_ITEMS = [
        {
            'name': 'Bagpipes',
            'cost': '30gp',
            'desc': ''
        },
        {
            'name': 'Drum',
            'cost': '6gp',
            'desc': ''
        },
        {
            'name': 'Dulcimer',
            'cost': '25gp',
            'desc': ''
        }, {
            "name": "Flute",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Lute",
            "cost": "35gp",
            "desc": ""
        }, {
            "name": "Lyre",
            "cost": "30gp",
            "desc": ""
        }, {
            "name": "Horn",
            "cost": "3gp",
            "desc": ""
        }, {
            "name": "Pan flute",
            "cost": "12gp",
            "desc": ""
        }, {
            "name": "Shawm",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Viol",
            "cost": "30gp",
            "desc": ""
        }
    ]

    static PAINTER_ITEMS = [
        {
            'name': 'Small painting',
            'cost': '1,500,gp',
            'desc': '',
            'type': Item.VARY_COST_TYPE
        },
        {
            'name': 'Large painting',
            'cost': '10,5000,gp',
            'desc': '',
            'type': Item.VARY_COST_TYPE
        },
        {
            'name': 'Bucket of paint',
            'cost': '1gp',
            'desc': ''
        }, {
            "name": "Painter's Supplies",
            "cost": "10gp",
            "desc": ""
        }
    ]

    static POTTER_ITEMS = [
        {
            'name': 'Simple Vase',
            'cost': '1gp',
            'desc': ''
        },
        {
            'name': 'Pound of clay',
            'cost': '1sp',
            'desc': ''
        },
        {
            'name': 'Fancy vase',
            'cost': '20gp',
            'cost': '10,5000,gp',
            'desc': '',
            'type': Item.VARY_COST_TYPE
        }, {
            "name": "Jug or pitcher",
            "cost": "2cp",
            "desc": ""
        }, {
            "name": "Potter's Tools",
            "cost": "10gp",
            "desc": ""
        }
    ]
    
    static SHADY_PAWN_SHOP_ITEMS = [
        {
            'name': 'Burglar\'s Pack',
            'cost': '16gp',
            'desc': ''
        },
        {
            'name': 'Disguise kit',
            'cost': '25gp',
            'desc': ''
        },
        {
            'name': 'Forgery kit',
            'cost': '15gp',
            'desc': ''
        },
        {
            'name': 'Dice set',
            'cost': '1sp',
            'desc': ''
        },
        {
            'name': 'Dragonchess set',
            'cost': '1gp',
            'desc': ''
        },
        {
            'name': 'Playing card set',
            'cost': '5sp',
            'desc': ''
        },
        {
            'name': 'Three-Dragon Ante set',
            'cost': '1gp',
            'desc': ''
        }, {
            "name": "Poisoner's kit",
            "cost": "50gp",
            "desc": ""
        }, {
            "name": "Thieve\'s tools",
            "cost": "25gp",
            "desc": ""
        }
    ]

    static STABLE_ITEMS = [
        {
            "name": "Camel",
            "cost": "25gp",
            "desc": ""
        },
        {
            'name': 'Donkey',
            'cost': '8gp',
            'desc': ''
        },
        {
            'name': 'Draft horse',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Elephant',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Mastiff',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Pony',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Riding horse',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Warhorse',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Bit and bridle',
            'cost': '2gp',
            'desc': ''
        },
        {
            'name': 'Carriage',
            'cost': '100gp',
            'desc': ''
        },
        {
            'name': 'Cart',
            'cost': '15gp',
            'desc': ''
        },
        {
            'name': 'Chariot',
            'cost': '250gp',
            'desc': ''
        },
        {
            'name': 'Saddlebags',
            'cost': '4gp',
            'desc': ''
        },
        {
            'name': 'Sled',
            'cost': '20gp',
            'desc': ''
        }
        ,
        {
            'name': 'Wagon',
            'cost': '35gp',
            'desc': ''
        },
        {
            'name': 'Exotic',
            'cost': '60gp',
            'desc': ''
        },
        {
            'name': 'Military',
            'cost': '20gp',
            'desc': ''
        },
        {
            'name': 'Pack',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'Riding',
            'cost': '10gp',
            'desc': ''
        }
    ]

    static SHIPYARD_ITEMS = [
        {
            'name': 'Galley',
            'cost': '30,000gp',
            'desc': ''
        },
        {
            'name': 'Keelboat',
            'cost': '3,000gp',
            'desc': ''
        },
        {
            'name': 'Longship',
            'cost': '10,000gp',
            'desc': ''
        }, {
            "name": "Rowboat",
            "cost": "50gp",
            "desc": ""
        }, {
            "name": "Sailing ship",
            "cost": "10,000gp",
            "desc": ""
        }, {
            "name": "Warship",
            "cost": "25,000gp",
            "desc": ""
        }
    ]

    static TINKERER_ITEMS = [
        {
            'name': 'Clock',
            'cost': '50gp',
            'desc': ''
        },
        {
            'name': 'Clockwork toy',
            'cost': '10,50,gp',
            'desc': '',
            'type': Item.VARY_COST_TYPE
        },{
            "name": "Tinker's Tools",
            "cost": "50gp",
            "desc": ""
        }
    ]

    static WAITER_ITEMS = [
        {
            'name': 'Ale',
            'cost': '1cp',
            'desc': ''
        },
        {
            'name': 'The special',
            'cost': '3sp',
            'desc': ''
        },
        {
            'name': 'Feast',
            'cost': '10gp',
            'desc': ''
        }, {
            "name": "Flask or tankard",
            "cost": "2cp",
            "desc": ""
        }
    ]

    static WEAVER_ITEMS = [
        {
            'name': 'Clothes, common',
            'cost': '5sp',
            'desc': ''
        },
        {
            'name': 'Clothes, fine',
            'cost': '15gp',
            'desc': ''
        },
        {
            'name': 'Clothes, traveler\'s',
            'cost': '2gp',
            'desc': ''
        },
        {
            'name': 'Net',
            'cost': '1gp',
            'desc': ''
        }, {
            "name": "Bedroll",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Blanket",
            "cost": "5sp",
            "desc": ""
        }, {
            "name": "Bucket",
            "cost": "5cp",
            "desc": ""
        }, {
            "name": "Caltrops (bag of 20)",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Clothes, common",
            "cost": "5sp",
            "desc": ""
        }, {
            "name": "Clothes, costume",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Clothes, fine",
            "cost": "15gp",
            "desc": ""
        }, {
            "name": "Clothes, traveler's",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Robes",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Rope, hempen (50 feet)",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Rope, silk (50 feet)",
            "cost": "10gp",
            "desc": ""
        }, {
            "name": "Sack",
            "cost": "1cp",
            "desc": ""
        }, {
            "name": "Weaver's Tools",
            "cost": "1gp",
            "desc": ""
        }
    ]

    static WOODCARVER_ITEMS = [
        {
            'name': 'Chair',
            'cost': '5gp',
            'desc': ''
        },
        {
            'name': 'Table',
            'cost': '25gp',
            'desc': ''
        },
        {
            'name': 'Club',
            'cost': '1gp',
            'desc': ''
        },
        {
            'name': 'Greatclub',
            'cost': '1sp',
            'desc': ''
        },
        {
            'name': 'Blowgun',
            'cost': '10gp',
            'desc': ''
        },
        {
            'name': 'Crossbow, hand',
            'cost': '75gp',
            'desc': ''
        },
        {
            'name': 'Crossbow, heavy',
            'cost': '50gp',
            'desc': ''
        },
        {
            'name': 'Longbow',
            'cost': '50gp',
            'desc': ''
        },
        {
            'name': 'Shortbow',
            'cost': '25gp',
            'desc': ''
        },
        {
            'name': 'Arrows (20)',
            'cost': '1gp',
            'desc': ''
        },
        {
            'name': 'Blowgun Needles (50)',
            'cost': '1gp',
            'desc': ''
        },
        {
            'name': 'Crossbow bolts (20)',
            'cost': '1gp',
            'desc': ''
        },{
            "name": "Abacus",
            "cost": "2gp",
            "desc": ""
        }, {
            "name": "Basket",
            "cost": "4sp",
            "desc": ""
        }, {
            "name": "Case, crossbow bolt",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Chest",
            "cost": "5gp",
            "desc": ""
        }, {
            "name": "Flask or tankard",
            "cost": "2cp",
            "desc": ""
        }, {
            "name": "Ladder (10 foot)",
            "cost": "1sp",
            "desc": ""
        }, {
            "name": "Pole (10-foot)",
            "cost": "5cp",
            "desc": ""
        }, {
            "name": "Quiver",
            "cost": "1gp",
            "desc": ""
        }, {
            "name": "Ram, portable",
            "cost": "4gp",
            "desc": ""
        }, {
            "name": "Tinderbox",
            "cost": "5sp",
            "desc": ""
        }, {
            "name": "Woodcarver's Tools",
            "cost": "1gp",
            "desc": ""
        }
    ]

    static SERVICES = {
        'Alchemist': [{
            "name": "Commission work",
            "cost": "1gp/ per hour",
            "desc": "",
            'type': Item.SERVICE_TYPE
        }],
        'Brewery': [],
        'Calligrapher': [{
            "name": "Commission work",
            "cost": "1gp/ per hour",
            "desc": "",
            'type': Item.SERVICE_TYPE
        }],
        'Carpenter': [{
            "name": "Commission work",
            "cost": "1gp/ per hour",
            "desc": "",
            'type': Item.SERVICE_TYPE
        }],
        'Cartographer': [{
            "name": "Commission work",
            "cost": "1gp/ per hour",
            "desc": "",
            'type': Item.SERVICE_TYPE
        }],
        'Cobbler': [{
            "name": "Commission work",
            "cost": "1gp/ per hour",
            "desc": "",
            'type': Item.SERVICE_TYPE
        }],
        'Inn': [{
            'name': 'Room for the night',
            'cost': '2sp',
            'desc': 'A room to sleep for the night.',
            'type': Item.SERVICE_TYPE
        }],
        'Diner': [],
        'General': [],
        'Glassblower': [
            {
                "name": "Commission work",
                "cost": "1gp/ per hour",
                "desc": "",
                'type': Item.SERVICE_TYPE
            }
        ],
        'Jewler': [
            {
                "name": "Commission work",
                "cost": "2gp/ per hour",
                "desc": "",
                'type': Item.SERVICE_TYPE
            }
        ],
        'Leatherworker': [],
        'Magic Shop': [{
            'name': 'Enchantment services',
            'cost': '10gp/hour',
            'desc': '',
            'type': Item.SERVICE_TYPE
        }],
        'Mason': [{
            'name': 'Mason services',
            'cost': '5sp/hour',
            'desc': '',
            'type': Item.SERVICE_TYPE
        }],
        'Painter': [{
            "name": "Commission work",
            "cost": "1gp/ per hour",
            "desc": "",
            'type': Item.SERVICE_TYPE
        }],
        'Potter': [{
            "name": "Potter Services",
            "cost": "5sp/ per hour",
            "desc": "",
            'type': Item.SERVICE_TYPE
        }],
        'Blacksmith': [],
        'Tinker': [
            {
            'name': 'Tinkerer services',
            'cost': '1gp/hour',
            'desc': '',
            'type': Item.SERVICE_TYPE
        }],
        'Weaver': [],
        'Woodcarver': [],
        'Stable': [{
            'name': 'Stabling',
            'cost': '5sp/per day',
            'desc': '',
            'type': Item.SERVICE_TYPE
        },
        {
            'name': 'Feed',
            'cost': '5cp/per day',
            'desc': '',
            'type': Item.SERVICE_TYPE
        }]
    }

    static INVENTORY_MAP = {
        'Alchemist': Item.ALCHEMIST_ITEMS,
        'Brewery': Item.BREWMASTER_ITEMS,
        'Calligrapher': Item.CALLIGRAPHER_ITEMS,
        'Carpenter': Item.CARPENTER_ITEMS,
        'Cartographer': Item.CARTOGRAPHER_ITEMS,
        'Cobbler': Item.COBBLER_ITEMS,
        'Inn': Item.INNKEEPER_ITEMS,
        'Diner': Item.WAITER_ITEMS,
        'Glassblower': Item.GLASSBLOWER_ITEMS,
        'General': Item.GENERAL_STORE_ITEMS,
        'Jewler': Item.JEWLER_ITEMS,
        'Leatherworker': Item.LEATHERWORKER_ITEMS,
        'Mason': Item.MASON_ITEMS,
        'Magic Shop': Item.MAGIC_SHOP_ITEMS,
        'Painter': Item.PAINTER_ITEMS,
        'Potter': Item.POTTER_ITEMS,
        'Blacksmith': Item.BLACKSMITH_ITEMS,
        'Tinker': Item.TINKERER_ITEMS,
        'Weaver': Item.WEAVER_ITEMS,
        'Woodcarver': Item.WOODCARVER_ITEMS
    }

    constructor(profession) {
        let i = this.getItemFor(profession);
        
        if (typeof i.rarity==='object') {
            const chance = Random.int(1,10);
            if (chance<=i.rarity['threshold'])
                i = this.getItemFor(profession);
        }
        
        Object.assign(this, this.getItemFor(profession));
        
        if (this.type===Item.VARY_COST_TYPE) {
            const a = this.cost.split(',');
            this.cost = Random.int(parseInt(a[0]), parseInt(a[1]))+a[2];
        }
        this.amount = 1;

        //init searchable items
        if (Item.searchableItems===null) {
            Item.searchableItems = [];
            Item.itemLookup = {};
            for (const key in Item.INVENTORY_MAP) {
                if (Item.INVENTORY_MAP.hasOwnProperty(key)) {
                    const itemList = Item.INVENTORY_MAP[key];
                    for (let i = 0; i < itemList.length; i++) {
                        const item = itemList[i];
                        if (item.name in Item.itemLookup)
                            continue;
                        Item.searchableItems.push(item);
                        Item.itemLookup[item.name] = item;
                    }
                }
            }
            Item.searchableItems.sort(Item.itemSort);
        }
    }

    static getInventoryFor(profession, inventorySize) {
        const inventory = [];

        const services = Item.SERVICES[profession];

        for (let i = 0; i < services.length; i++) {
            inventory.push(services[i])
        }

        for (let i = 0; i < inventorySize; i++) {
            inventory.push(new Item(profession));
        }

        return inventory;
    }

    static itemSort(a,b) {
        if (a.name==b.name)
            return 0;
        if (a.name.charAt(0)==b.name.charAt(0) && a.name.length > 1 && b.name.length > 1) {
            let i = 1;
            let aChar = a.name.charAt(i);
            let bChar = b.name.charAt(i);
            while (aChar==bChar && i+1 != a.name.length && i+1 != b.name.length ) {
                i++;
                aChar = a.name.charAt(i);
                bChar = b.name.charAt(i);
            }
            if (aChar!=bChar) {
                if (aChar<bChar) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                if (a.name.length<b.name.length)
                    return -1;
                else
                    return 1;
            }
        } else if (a.name.charAt(0)<b.name.charAt(0)) {
            return -1
        } else {
            return 1;
        }
        return 0;
    }

    getItemFor(profession) {
        if (!(profession in Item.INVENTORY_MAP)) {
            console.warn(profession)
            throw "profession not found in map"
        }
        const list = Item.INVENTORY_MAP[profession];
        return list[Random.int(0, list.length)];
    }

}
