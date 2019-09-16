import { RawCharacterType } from '@/types/rawCharacterTypes'

export default function generateEquipment (rawCharacter: RawCharacterType) {
  // Requires item details from database
  return [
    {
      'name': 'Durasteel armor',
      'quantity': 1,
      'equipped': true,
      'description': 'Durasteel armor is an armor that reduced weight, but restricts movement. The armor is commony used by mercenaries, bounty hunters, soldiers, and civilians that live in dangerous areas.',
      'cost': 750,
      'weight': 55,
      'equipmentCategory': 'Armor',
      'armorClassification': 'Heavy',
      'ac': '16',
      'strengthRequirement': 'Str 13',
      'stealthDisadvantage': true
    },
    {
      'name': 'Heavy shield',
      'quantity': 1,
      'equipped': true,
      'description': 'Rather than an energy shield, heavy shields are physical composites of metal or plastic. They are much larger and more cumbersome, but they offer more protection than their smaller counterparts. Its cumbersome size, however, makes it unwieldy, and requires the use of a one-handed weapon with the *light* property in the other hand.\r\n\r\nSmall creatures have disadvantage on attack rolls while wielding a heavy shield. A heavy shield\'s size and bulk make it too large for a Small creature to use effectively.',
      'cost': 500,
      'weight': 28,
      'equipmentCategory': 'Armor',
      'armorClassification': 'Shield',
      'ac': '+3',
      'strengthRequirement': 'Str 17',
      'stealthDisadvantage': true
    },
    {
      'name': 'Blaster rifle',
      'equipped': true,
      'attackBonus': 4,
      'damageBonus': 1,
      'quantity': 1,
      'cost': 400,
      'weight': 11,
      'equipmentCategory': 'Weapon',
      'damageNumberOfDice': 1,
      'damageType': 'Energy',
      'damageDieModifier': 0,
      'weaponClassification': 'MartialBlaster',
      'damageDieType': 8,
      'properties': [
        'Ammunition (range 100/400)',
        'reload 12',
        'two-handed'
      ],
      'propertiesMap': {
        'Ammunition': 'Ammunition (range 100/400)',
        'Reload': 'reload 12',
        'Two-Handed': 'two-handed'
      }
    },
    {
      'name': 'Hold-out',
      'quantity': 1,
      'equipped': true,
      'attackBonus': 4,
      'damageBonus': 1,
      'cost': 250,
      'weight': 1,
      'equipmentCategory': 'Weapon',
      'damageNumberOfDice': 1,
      'damageType': 'Energy',
      'damageDieModifier': 0,
      'weaponClassification': 'SimpleBlaster',
      'damageDieType': 4,
      'properties': [
        'Ammunition (range 30/120)',
        'hidden',
        'light',
        'reload 6'
      ],
      'propertiesMap': {
        'Ammunition': 'Ammunition (range 30/120)',
        'Hidden': 'hidden',
        'Light': 'light',
        'Reload': 'reload 6'
      }
    },
    {
      'name': 'Medkit',
      'quantity': 2,
      'description': 'A common medkit can be stocked with bacta packs, and contains spray-bandages, bone stabilizers, antiseptics, and other essentials for the treatment of wounds. As an action, you can expend a use of the kit to stabilize a creature that has 0 hit points, without needing to make a Wisdom (Medicine) check. A medkit can be used to stabilize 5 times before it must be restocked at its original cost.',
      'cost': 50,
      'weight': 3,
      'equipmentCategory': 'Medical'
    },
    {
      'name': 'Biochemist\'s kit',
      'description': 'This kit includes all of the necessary components to create and house standard adrenals, medpacs, and stimpacs. Proficiency with this kit lets you add your proficiency bonus to any ability checks you make to identify adrenals, medpacs, and stimpacs. Also, proficiency with this kit is required to create adrenals, medpacs, and stimpacs.',
      'cost': 500,
      'weight': 8,
      'equipmentCategory': 'Kit',
      'quantity': 1
    },
    {
      'name': 'Clothes, common',
      'description': null,
      'cost': 5,
      'weight': 3,
      'equipmentCategory': 'Clothing',
      'quantity': 1
    },
    {
      'name': 'Backpack',
      'description': null,
      'cost': 50,
      'weight': 5,
      'equipmentCategory': 'Storage',
      'quantity': 1
    },
    {
      'name': 'Glowrod',
      'description': 'Glowrods create a beam of light illuminating the area around you in bright light for a 20-foot radius and dim light for an additional 20 feet. The glowrod lasts for 10 hours and can be recharged by connecting to a power source or by replacing the power cell. ',
      'cost': 10,
      'weight': 2,
      'equipmentCategory': 'Utility',
      'quantity': 5
    },
    {
      'name': 'Fusion cutter',
      'description': 'A fusion cutter is a handheld cutting tool popular among technicians. It cut through almost any reinforced material, given enough time. The internal power cell supplies an hour\'s worth of continuous operation.',
      'cost': 25,
      'weight': 2,
      'equipmentCategory': 'Utility',
      'quantity': 1
    },
    {
      'name': 'Chronometer',
      'description': 'A chronometer is a device that measures and keeps linear time.',
      'cost': 100,
      'weight': 1,
      'equipmentCategory': 'Utility',
      'quantity': 1
    },
    {
      'name': 'Grappling hook',
      'description': 'A grappling hook allows a user to climb or ascend large objects. It can be mounted to a blaster, belt, or elsewhere. It has a 50-foot length.',
      'cost': 50,
      'weight': 4,
      'equipmentCategory': 'Utility',
      'quantity': 1
    },
    {
      'name': 'Field rations (one day\'s)',
      'description': null,
      'cost': 5,
      'weight': 1,
      'equipmentCategory': 'Utility',
      'quantity': 10
    },
    {
      'name': 'Canteen',
      'description': null,
      'cost': 10,
      'weight': 3,
      'equipmentCategory': 'Utility',
      'quantity': 1
    },
    {
      'name': 'Fibercord cable, 50 ft (rolled)',
      'description': null,
      'cost': 20,
      'weight': 2,
      'equipmentCategory': 'Utility',
      'quantity': 1
    },
    {
      'name': 'Commlink',
      'description': 'Commlinks are standard handheld communication devices, fitted with microphones and receivers. A standard, personal commlinks have a range of up to 30 miles, but are reduced in dense, urban areas or areas of high level interference.',
      'cost': 50,
      'weight': 1,
      'equipmentCategory': 'Communications',
      'quantity': 4
    },
    {
      'name': 'Medium shield generator',
      'description': 'A personal shield generator was a defensive technology that projected a field of energy that protected the user from blaster fire, the elements, or other hazards. Most were designed to be held much like a traditional physical shield. The medium shield generator is used in conjunction with any one-handed weapon.',
      'cost': 100,
      'weight': 14,
      'equipmentCategory': 'Armor',
      'quantity': 1
    },
    {
      'name': 'Light battle armor',
      'description': 'Providing solid protection for a minimal cost, light battle armor is considered excellent protection for entrenched troops or guards. However, this protection comes at a cost of mobility, limiting its uses by rapidly advancing infantry. Still, it provides more mobility than full battle armor.',
      'cost': 500,
      'weight': 20,
      'equipmentCategory': 'Armor',
      'quantity': 1
    },
    {
      'name': 'custom',
      'notes': 'Damage Powered Durasteel Armor',
      'quantity': 1
    }
  ]
}