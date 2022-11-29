import { RawCharacterType, RawFeatType } from '@/types/rawCharacterTypes'
import { FeatType } from '@/types/characterTypes'
import { CompletedFeatureType } from '@/types/completeCharacterTypes'

export default function generateFeats (rawCharacter: RawCharacterType, feats: FeatType[]): CompletedFeatureType[] {
  var finalFeats: CompletedFeatureType[] = []

  for (var myClass of rawCharacter.classes) {
    for (var asi of myClass.abilityScoreImprovements) {
      if (asi.type === 'Feat') {
        var myFeat = asi as RawFeatType
        var rawFeat = JSON.parse(JSON.stringify(feats.find(f => f.name === myFeat.name))) as CompletedFeatureType

        rawFeat.metadata = typeof (rawFeat.metadata) === 'string' ? JSON.parse(rawFeat.metadata || '{}') : rawFeat.metadata
        rawFeat.combat = true
        rawFeat.customIndex = -1
        rawFeat.source = 'Feat'
        rawFeat.sourceName = myClass.name

        finalFeats.push(rawFeat)
      }
    }
  }

  for (var featIx = 0; featIx < rawCharacter.customFeats.length; featIx++) {
    var feat = rawCharacter.customFeats[featIx]
    var customFeat = JSON.parse(JSON.stringify(feats.find(f => f.name === feat))) as CompletedFeatureType

    customFeat.metadata = typeof (customFeat.metadata) === 'string' ? JSON.parse(customFeat.metadata || '{}') : customFeat.metadata
    customFeat.combat = true
    customFeat.customIndex = featIx
    customFeat.source = 'Feat'
    customFeat.sourceName = 'Custom'

    finalFeats.push(customFeat)
  }

  var bgFeat = JSON.parse(JSON.stringify(rawCharacter.background.feat)) as CompletedFeatureType
  bgFeat.metadata = typeof (bgFeat.metadata) === 'string' ? JSON.parse(bgFeat.metadata || '{}') : bgFeat.metadata
  bgFeat.combat = true
  bgFeat.customIndex = -1
  bgFeat.source = 'Background'
  bgFeat.sourceName = rawCharacter.background.name
  finalFeats.push(bgFeat)

  return finalFeats
}
