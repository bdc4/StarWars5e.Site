import { FeatureType, MetadataType } from '@/types/characterTypes'
import fetchFromCache from '@/utilities/fetchFromCache'
import { Module, VuexModule, MutationAction } from 'vuex-module-decorators'

@Module({ namespaced: true, name: 'features' })
export default class Features extends VuexModule {
  features: FeatureType[] = []
  cachedVersion: number = 0

  @MutationAction({ mutate: ['features', 'cachedVersion'] })
  async fetchFeatures () {
    var { data: features, cachedVersion } = await fetchFromCache(this, 'features', 'feature')
    features = features.map((feat: FeatureType) => {
      if (!feat.metadata) feat.metadata = {}
      if (typeof (feat.metadata) === typeof ('')) {
        feat.metadata = JSON.parse(feat.metadata as string) as MetadataType
      }
      return feat
    })
    return { features, cachedVersion }
  }
}
