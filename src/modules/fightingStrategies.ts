import fetchFromCache from '@/utilities/fetchFromCache'
import { Module, VuexModule, MutationAction } from 'vuex-module-decorators'
import { FightingStrategyType } from '@/types/characterTypes'

@Module({ namespaced: true, name: 'fightingStrategies' })
export default class FightingStrategies extends VuexModule {
  fightingStrategies: FightingStrategyType[] = []
  cachedVersion: number = 0

  @MutationAction({ mutate: ['fightingStrategies', 'cachedVersion'] })
  async fetchFightingStrategies () {
    const { data: fightingStrategies, cachedVersion } = await fetchFromCache(this, 'fightingStrategies', 'fightingStrategy')
    return { fightingStrategies, cachedVersion }
  }
}
