import { ChoiceConfigType, RawCharacterType } from '@/types/rawCharacterTypes'
import { FeatureType, BackgroundType, MetadataType } from '@/types/characterTypes'
import { chain, uniqueId, range } from 'lodash'
import { CompletedFeatureType, AbilityScoresType } from '@/types/completeCharacterTypes'

export var FEATURES_WITH_FIGHTING_STYLES = [
  'Archetype-Assault Specialist-Additional Fighting Style-10',
  'Class-Fighter-Fighting Style-1',
  'Class-Guardian-Fighting Style-2',
  'Class-Scout-Fighting Style-2',
  'Fighting Stylist'
]
export var FEATURES_WITH_FIGHTING_STRATEGIES = [
  'Class-Fighter-Fighter Strategies-3'
]

function calculateUsage (
  rawCharacter: RawCharacterType,
  abilityScores: AbilityScoresType,
  feature: CompletedFeatureType
) {
  if (!feature.usage) {
    return {
      ...feature,
      combat: true
    }
  }
  const maximum = isNaN(feature.usage.maximum) ? abilityScores[feature.usage.maximum].modifier : feature.usage.maximum

  return {
    ...feature,
    usage: {
      recharge: feature.usage.recharge,
      used: rawCharacter.currentStats.featuresTimesUsed[feature.name],
      maximum
    }
  }
}

export default function generateFeatures (
  rawCharacter: RawCharacterType,
  features: FeatureType[],
  currentLevel: number,
  myFeats: CompletedFeatureType[],
  myBackground: BackgroundType | undefined,
  backgrounds: BackgroundType[],
  abilityScores: AbilityScoresType
) : {
  combatFeatures: CompletedFeatureType[],
  nonCombatFeatures: CompletedFeatureType[],
  backgroundFeature: CompletedFeatureType | undefined
} {
  const featureSources = {
    [rawCharacter.species.name]: currentLevel,
    ...chain(rawCharacter.classes).groupBy('name').mapValues(classes => classes[0].levels).value(),
    ...chain(rawCharacter.classes).filter('archetype').groupBy('archetype.name').mapValues(classes => classes[0].levels).value()
  }
  const myFeatures = chain(features.map(f => JSON.parse(JSON.stringify(f))))
    .filter(({ sourceName, level }) =>
      Object.keys(featureSources).includes(sourceName) &&
      level <= featureSources[sourceName]
    )
    .sortBy('level')
    .reverse()
    .uniqBy(({ name, sourceName }) => name + sourceName)
    .reverse()
    .value()
  const myCompletedFeatures = [
    ...myFeatures,
    ...myFeats
  ].map(feature => calculateUsage(rawCharacter, abilityScores, feature as CompletedFeatureType))

  const backgroundWithFeature = rawCharacter.background.name === 'Custom' ? backgrounds.find(({ featureName }) => featureName === rawCharacter.background.feature) : myBackground
  const backgroundFeature = backgroundWithFeature ? {
      name: backgroundWithFeature.featureName,
      combat: false,
      config: undefined,
      text: backgroundWithFeature.featureText,
      source: 'Background',
      sourceName: backgroundWithFeature.name,
      rowKey: backgroundWithFeature.featureName,
      level: undefined
  } : undefined

  return {
    combatFeatures: myCompletedFeatures.filter(({ combat }) => combat),
    nonCombatFeatures: myCompletedFeatures.filter(({ combat }) => !combat),
    backgroundFeature
  }
}
