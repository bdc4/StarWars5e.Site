import fetchFromCache from '@/utilities/fetchFromCache'
import { Module, VuexModule, MutationAction } from 'vuex-module-decorators'
import { FightingStrategyType, MetadataType } from '@/types/characterTypes'

@Module({ namespaced: true, name: 'fightingStrategies' })
export default class FightingStrategies extends VuexModule {
  fightingStrategies: FightingStrategyType[] = []
  cachedVersion: number = 0

  @MutationAction({ mutate: ['fightingStrategies', 'cachedVersion'] })
  async fetchFightingStrategies () {
    var { data: fightingStrategies, cachedVersion } = await fetchFromCache(this, 'fightingStrategies', 'fightingStrategy')
    fightingStrategies = fightingStrategies.map((feat: FightingStrategyType) => {
      if (!feat.metadata) feat.metadata = {}
      if (typeof (feat.metadata) === typeof ('')) {
        feat.metadata = JSON.parse(feat.metadata as string) as MetadataType
      }
      return feat
    })
    return { fightingStrategies, cachedVersion }
  }
}
