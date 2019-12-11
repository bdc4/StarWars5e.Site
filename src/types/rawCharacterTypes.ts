export interface RawSpeciesType {
  name: string,
  abilityScoreImprovementSelectedOption: number,
  abilityScoreImprovement: {
    [abilityScore: string]: number
  },
  toolProficiency?: string,
  skillProficiency?: string,
  weaponProficiency?: string,
  language?: string
}

export interface RawFeatType {
  type: 'Ability Score Improvement' | 'Feat',
  name: string,
  abilityScoreImprovements?: {
    [ability: string]: number
  }
}

export interface RawArchetypeType {
  name: string,
  silverTongue?: {
    language: string,
    intSkillBonus: string
  },
  forcePowers?: string[],
  techPowers?: string[],
  maneuvers?: string[]
}

export interface RawASIType {
  type: 'Ability Score Improvement' | 'Feat',
  abilitiesIncreased: {
    name: string,
    value: number
  }[]
}

export interface RawClassType {
  name: string,
  levels: number,
  hitPoints: number[],
  toolProficiency?: string,
  skills: string[],
  fightingStyle?: string,
  techPowers?: string[],
  forcePowers?: string[],
  maneuvers?: string[],
  discoveries?: {
    name: string
  }[],
  expertise?: string[],
  archetype?: RawArchetypeType,
  abilityScoreImprovements: (RawFeatType | RawASIType)[]
}

export interface RawBackgroundType {
  name: string,
  skills: string[],
  toolProficiencies?: string[],
  languages?: string[],
  feat?: RawFeatType
}

export interface RawCharacteristicsType {
  alignment: string,
  'Personality Traits': string,
  Ideal: string,
  Bond: string,
  Flaw: string,
  Gender: string,
  'Place of Birth': string,
  Age: string,
  Height: string,
  Weight: string,
  Hair: string,
  Eyes: string,
  Skin: string,
  Appearance: string,
  Backstory: string
}

export interface RawEquipmentType {
  name: string,
  quantity: number,
  equipped?: boolean
}

export interface TweakType {
  override?: number,
  bonus?: number
}

export interface CastingTweakType {
  maxPoints?: TweakType,
  attackModifier?: TweakType,
  saveDC?: TweakType,
  maxPowerLevel?: TweakType
}

export interface TweaksType {
  abilityScores?: {
    [ability: string]: {
      score?: TweakType,
      savingThrowModifier?: TweakType,
      skills?: {
        [name: string]: TweakType
      }
    }
  },
  initiative?: TweakType,
  proficiencyBonus?: TweakType,
  armorClass?: TweakType,
  weapon?: {
    toHit?: TweakType,
    damage?: TweakType
  }
  hitPoints?: {
    maximum?: TweakType,
    hitDice?: {
      [size: string]: TweakType
    }
  },
  passivePerception?: TweakType,
  vision?: TweakType,
  speed?: {
    base?: TweakType
  },
  techCasting?: CastingTweakType,
  forceCasting?: CastingTweakType,
  superiority?: {
    maxDice?: TweakType,
    maneuverSaveDC?: TweakType
  }
}

export interface CustomProficiencyType {
  name: string,
  proficiencyLevel: 'proficiency' | 'expertise'
}

export type AbilityScoreMethodType = 'Standard Array' | 'Point Buy' | 'Manual'

export interface RawCharacterType {
  name: string,
  image: string,
  experiencePoints: number,
  species: RawSpeciesType,
  classes: RawClassType[],
  baseAbilityScores: {
    [ability: string]: number
  },
  background: RawBackgroundType,
  characteristics: RawCharacteristicsType,
  credits: number,
  equipment: RawEquipmentType[],
  currentStats: {
    hitPoints: number,
    temporaryHitPoints: number,
    techPoints: number,
    forcePoints: number,
    superiorityDice: number,
    hitDiceUsed: {
      d6?: number,
      d8?: number,
      d10?: number,
      d12?: number
    },
    deathSaves: {
      successes: number,
      failures: number
    },
    hasInspiration: boolean,
    featuresTimesUsed: {
      [feature: string]: number
    },
    conditions: string[],
    exhaustion: number
  },
  tweaks: TweaksType,
  customLanguages: string[],
  customProficiencies: CustomProficiencyType[],
  customFeatures: {
    name: string,
    content: string
  }[],
  settings: {
    isFixedHitPoints: boolean,
    abilityScoreMethod: AbilityScoreMethodType | string // Added | string to avoid error when importing JSON
  }
}
