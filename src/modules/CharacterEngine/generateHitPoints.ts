import { RawCharacterType } from '@/types/rawCharacterTypes'
import { AbilityScoresType, CastingType, SuperiorityType, CompletedFeatureType } from '@/types/completeCharacterTypes'
import { ClassType } from '@/types/characterTypes'
import { chain, isEmpty } from 'lodash'

export default function generateHitPoints (
  rawCharacter: RawCharacterType,
  abilityScores: AbilityScoresType,
  classes: ClassType[],
  currentLevel: number,
  casting: { techCasting: CastingType | {}, forceCasting: CastingType | {} },
  superiority: SuperiorityType | {},
  features: { combatFeatures: CompletedFeatureType[], nonCombatFeatures: CompletedFeatureType[]}
) {
  const startingClass = rawCharacter.classes.find(({ isStartingClass }) => isStartingClass)
  const startingClassData = startingClass && classes.find(({ name }) => name === startingClass.name)
  const hpFromFirstLevel = (startingClassData && startingClassData.hitDiceDieType) || 0
  const hpFromLaterLevels = rawCharacter.classes.reduce((acc, myClass) => acc + myClass.hitPoints.reduce((hpAcc, value) => hpAcc + value, 0), 0)
  const maximum = hpFromFirstLevel + hpFromLaterLevels + (currentLevel * abilityScores.Constitution.modifier)
  const featuresWithUsage = [ ...features.combatFeatures, ...features.nonCombatFeatures ].filter(({ usage }) => !isEmpty(usage))

  const hitDice = chain(rawCharacter.classes)
    .groupBy(rawClass => {
      const classData = classes.find(({ name }) => name === rawClass.name)
      return classData && classData.hitDiceDieType
    })
    .map((classes, size) => {
      const maximum = classes.reduce((acc, { levels }) => acc + levels, 0)
      const hitDiceUsed = rawCharacter.currentStats.hitDiceUsed['d' + size as 'd6' | 'd8' | 'd10' | 'd12'] || 0
      return ({
        size: 'd' + size,
        current: maximum - hitDiceUsed,
        maximum
      })
    })
    .value()

  const numHitDiceUsed = Object.values(rawCharacter.currentStats.hitDiceUsed).reduce((acc, count) => (acc || 0) + (count || 0), 0)
  let hitDiceToRegain = Math.max(1, Math.floor(currentLevel / 2))
  const hitDiceRestored = chain(rawCharacter.currentStats.hitDiceUsed)
    .map((val, key) => ({ size: key, numUsed: val }))
    .sortBy(({ size }) => parseInt(size.substr(1)))
    .reverse()
    .map(({ size, numUsed }) => {
      const numRestored = Math.min(numUsed || 0, hitDiceToRegain)
      hitDiceToRegain -= numRestored
      return { size, numRestored }
    })
    .filter(({ numRestored }) => numRestored)
    .value()

  const resting = {
    hitDieBonus: abilityScores.Constitution.modifier,
    numHitDiceUsed,
    hitDiceRestored,
    maxForcePoints: isEmpty(casting.forceCasting) ? 0 : (casting.forceCasting as CastingType).maxPoints,
    maxTechPoints: isEmpty(casting.techCasting) ? 0 : (casting.techCasting as CastingType).maxPoints,
    maxSuperiorityDice: isEmpty(superiority) ? 0 : (superiority as SuperiorityType).maxDice,
    shortRestFeatures: featuresWithUsage.filter(({ usage }) => usage && usage.recharge === 'shortRest').map(({ name }) => name),
    longRestFeatures: featuresWithUsage.map(({ name }) => name)
  }

  return ({
    current: rawCharacter.currentStats.hitPoints,
    maximum,
    hitDice,
    deathSaves: rawCharacter.currentStats.deathSaves,
    resting
  })
}