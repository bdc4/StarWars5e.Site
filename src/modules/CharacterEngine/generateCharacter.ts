import { ChoiceConfigType, RawCharacterType } from '@/types/rawCharacterTypes'
import { compact, chain, uniqueId } from 'lodash'
import { ClassType, PowerType, FeatType, BackgroundType, SpeciesType, ArchetypeType, ManeuverType, FeatureType, FightingStrategyType } from '@/types/characterTypes'
import { EquipmentType, EnhancedItemType } from '@/types/lootTypes'
import generateAbilityScores from './generateAbilityScores'
import generateCombatStats from './generateCombatStats'
import generateHitPoints from './generateHitPoints'
import generateProficiencies from './generateProficiencies'
import generateLanguages from './generateLanguages'
import generateEquipment from './generateEquipment'
import generateCarryingCapacity from './generateCarryingCapacity'
import generateSuperiorty from './generateSuperiority'
import generateCasting from './generateCasting'
import generateFeatures from './generateFeatures'
import generateFeats from './generateFeats'
import generateWeapons from './generateWeapons'
import applyTweak from '@/utilities/applyTweak'
import { CharacterAdvancementType, SkillType, ConditionType } from '@/types/lookupTypes'
import generateExperiencePoints from './generateExperiencePoints'
import { CompleteCharacterType, CompletedFeatureType, CompletedFightingStrategyType } from '@/types/completeCharacterTypes'
import generateAttunement from './generateAttunement'
import FightingStrategies from '../fightingStrategies'

// Combines rawCharacter.ChoiceConfig with real feature data for easy consumption. When a ChoiceConfig is matched it is removed from the pool
export function mapChoiceConfigs (
  source: CompletedFeatureType | FeatureType | CompletedFightingStrategyType,
  sourceType: string,
  remainingChoiceConfigs: ChoiceConfigType[]) {
  if (remainingChoiceConfigs.length > 0) {
    // if there are any remaining feature configs then lets try to map it
    let configIx = remainingChoiceConfigs
      .filter(c => c.referenceType === sourceType)
      .findIndex(f => f.referenceRowKey === (source as any).rowKey)
    if (configIx > -1) {
      // found a matching source(feature) config - we will assign it a tempId so we can reference the specific record
      source.config = remainingChoiceConfigs[configIx]
      remainingChoiceConfigs.splice(configIx, 1)
    } else {
      delete source.config
    }
  }
  return remainingChoiceConfigs
}

export default function generateCharacter (
  rawCharacter: RawCharacterType,
  classes: ClassType[],
  archetypes: ArchetypeType[],
  species: SpeciesType[],
  equipment: EquipmentType[],
  enhancedItems: EnhancedItemType[],
  powers: PowerType[],
  maneuvers: ManeuverType[],
  feats: FeatType[],
  features: FeatureType[],
  backgrounds: BackgroundType[],
  characterAdvancements: CharacterAdvancementType[],
  skills: SkillType[],
  conditions: ConditionType[],
  fightingStrategies: FightingStrategyType[]
): CompleteCharacterType {
  // To Do
  const classText = rawCharacter.classes
    .map(({ name, levels, archetype }) => `${name}${archetype ? ` (${archetype.name})` : ''} ${levels}`)
    .join(', ')
  const myClasses = rawCharacter.classes.map(({ name }) => classes.find(myClass => name === myClass.name))
  if (myClasses.includes(undefined)) console.error('Class not found from ' + rawCharacter.classes.map(({ name }) => name))
  const myFoundClasses = compact(myClasses)
  const consular = classes.find(myClass => myClass.name === 'Consular') // Used in place of Multiclass Max Power Level Table for now
  if (!consular) console.error('Class not found: consular')
  const myArchetypes = compact(rawCharacter.classes.map(({ archetype }) => archetype && archetypes.find(myArchetype => archetype.name === myArchetype.name)))
  const skillsMap = chain(['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'])
    .keyBy()
    .mapValues(ability => skills.filter(({ baseAttribute }) => ability === baseAttribute).map(({ name }) => name))
    .value()

  const conditionsMap = chain(conditions)
    .keyBy('name')
    .mapValues(({ description }) => description.replace(/\\r\\n/g, '\n'))
    .value()
  const mySpecies = species.find(({ name }) => name === rawCharacter.species.name)
  if (!mySpecies) console.error('Species not found: ', rawCharacter.species.name)

  const currentLevel = rawCharacter.classes.reduce((acc, { levels }) => acc + levels, 0)
  const proficiencyBonus = applyTweak(rawCharacter, 'proficiencyBonus', 1 + Math.ceil(currentLevel / 4))
  const experiencePoints = generateExperiencePoints(rawCharacter, characterAdvancements, currentLevel)

  const myFeats = generateFeats(rawCharacter, feats)
  const { abilityScores, skillAndSaveProficiencies } = generateAbilityScores(rawCharacter, myFoundClasses, mySpecies, proficiencyBonus, skillsMap)
  const myConditions = rawCharacter.currentStats.conditions.map(condition => ({
    name: condition,
    description: (conditionsMap as { [key: string]: string })[condition]
  }))
  const myBackground = backgrounds.find(({ name }) => name === rawCharacter.background.name)
  const proficiencies = generateProficiencies(rawCharacter, myFoundClasses, myBackground)
  const myEquipment = generateEquipment(rawCharacter, equipment, enhancedItems, abilityScores, proficiencyBonus, proficiencies)
  const casting = generateCasting(rawCharacter, abilityScores, powers, proficiencyBonus, myFoundClasses, consular, myArchetypes)
  const superiority = generateSuperiorty(rawCharacter, myFoundClasses, myArchetypes, abilityScores, proficiencyBonus, maneuvers)
  const myFeatures = generateFeatures(
    rawCharacter,
    features,
    currentLevel,
    myFeats,
    myBackground,
    backgrounds,
    abilityScores
  )
  // Any existing raw feature configs will be tagged with localIds when loaded up, this is used to tie back the relationship
  // useful in scenarios where Features are not unique (like Feats taken more than once)
  rawCharacter.choiceConfigs = rawCharacter.choiceConfigs || []
  for (var fc of rawCharacter.choiceConfigs) {
    if (!fc.localId) {
      fc.localId = uniqueId()
    }
  }

  let remainingChoiceConfigs: ChoiceConfigType[] = JSON.parse(JSON.stringify(rawCharacter.choiceConfigs))
  for (var feature of [...myFeatures.combatFeatures, ...myFeatures.nonCombatFeatures]) {
    remainingChoiceConfigs = mapChoiceConfigs(feature, 'FeatureType', remainingChoiceConfigs)
  }
  for (var fs of fightingStrategies) {
    remainingChoiceConfigs = mapChoiceConfigs(fs, 'FightingStrategyType', remainingChoiceConfigs)
  }
  // for (var feat of myFeats) {
  //   remainingChoiceConfigs = mapChoiceConfigs(feat, 'FeatType', remainingChoiceConfigs)
  // }

  // If any remaining feature configs are still present then they likely need to be trimmed
  rawCharacter.choiceConfigs = rawCharacter.choiceConfigs.filter(fc => remainingChoiceConfigs.findIndex(o => o.localId === fc.localId) === -1)

  var completed = {
    name: rawCharacter.name,
    builderVersion: rawCharacter.builderVersion,
    image: rawCharacter.image,
    characteristics: rawCharacter.characteristics,
    tweaks: rawCharacter.tweaks,
    customProficiencies: rawCharacter.customProficiencies,
    customLanguages: rawCharacter.customLanguages,
    customFeatures: rawCharacter.customFeatures,
    customTechPowers: rawCharacter.customTechPowers,
    customForcePowers: rawCharacter.customForcePowers,
    customEquipment: rawCharacter.customEquipment,
    numCustomFeats: rawCharacter.customFeats.length,
    currentLevel,
    classText,
    alignment: rawCharacter.characteristics.alignment,
    species: rawCharacter.species.name,
    background: rawCharacter.background.name,
    experiencePoints,
    abilityScores,
    proficiencyBonus,
    ...generateCombatStats(rawCharacter, abilityScores, myEquipment),
    hitPoints: generateHitPoints(rawCharacter, abilityScores, myFoundClasses, currentLevel, myFeatures),
    conditions: myConditions,
    exhaustion: rawCharacter.currentStats.exhaustion,
    proficiencies,
    skillAndSaveProficiencies,
    languages: generateLanguages(rawCharacter),
    equipment: myEquipment,
    attunement: generateAttunement(myEquipment, proficiencyBonus),
    weapons: generateWeapons(rawCharacter, myEquipment, abilityScores, proficiencyBonus),
    credits: Math.max(rawCharacter.credits, 0),
    carryingCapacity: generateCarryingCapacity(abilityScores),
    superiority,
    ...casting,
    ...myFeatures,
    settings: rawCharacter.settings,
    notes: rawCharacter.notes
  }

  return completed
}
