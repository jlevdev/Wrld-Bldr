import NameGen from "./NameGen";

export default class NPCNameGenerator {

    static NPC_RACES = [
        'Dragonborn',
        'Dwarf',
        'Elf',
        'Gnome',
        'Half-elf',
        'Halfling',
        'Half-orc',
        'Human',
        'Tiefling',
        'Orc',
        'Aarakocra',
        'Genasi',
        'Goliath',
        'Aasimar',
        'Bugbear',
        'Firbolg',
        'Goblin',
        'Hobgoblin',
        'Kenku',
        'Kobold',
        'Lizardfolk',
        'Orc',
        'Tabaxi',
        'Triton',
        'Yuan-ti Pureblood',
        'Feral Tiefling',
        'Tortle',
        'Kalashtar',
        'Changeling',
        'Shifter',
        'Warforged',
        'Centaur',
        'Loxodon',
        'Minotaur'
    ];

    static NAME_CHUNKS = {

    }

    static SURNAME_CHUNKS = {

    }

    static forRace(race, fullname=true) {
        return NameGen.compile('!sV !BVs').toString();
    }


}