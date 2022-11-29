<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { CompletedFeatureType } from '@/types/completeCharacterTypes'
  import { FeatureType, FightingStrategyType, FightingStyleType, PowerType } from '@/types/characterTypes'
  import VueMarkdown from 'vue-markdown'
  import CheckList from '@/components/CheckList.vue'
  import ConfirmDelete from '@/components/ConfirmDelete.vue'
  import { namespace } from 'vuex-class'
  import FightingStrategyChoice from '@/components/FightingStrategyChoice.vue'
  import FightingStyleChoice from '../../../../components/FightingStyleChoice.vue'
  import FeatureDetail from '@/components/FeatureDetail.vue'

  const fightingStyleModule = namespace('fightingStyles')
  const fightingStrategiesModule = namespace('fightingStrategies')

  @Component({
    components: {
      CheckList,
      VueMarkdown,
      ConfirmDelete,
      FeatureDetail
    }
  })
  export default class CharacterSheetExpansionFeatures extends Vue {
    @Prop(Array) readonly features!: CompletedFeatureType[] | PowerType[]
    @Prop(Array) readonly choiceConfigs!: CompletedFeatureType[] | PowerType[]
    @Prop(Boolean) readonly isShowingLevel!: boolean

    @fightingStyleModule.State fightingStyles!: FightingStyleType[]
    @fightingStyleModule.Action fetchFightingStyles!: () => void
    @fightingStrategiesModule.State fightingStrategies!: FightingStrategyType[]
    @fightingStrategiesModule.Action fetchFightingStrategies!: () => void

    created () {
      this.fetchFightingStyles()
    }

    isChoiceNeeded (f: CompletedFeatureType) {
      return (f.metadata && f.metadata.fightingMastery && !f.config) ||
        (f.metadata && f.metadata.fightingStrategy && !f.config) ||
        (f.metadata && f.metadata.fightingStyle && !f.config)
    }
  }
</script>

<template lang="pug">
  v-expansion-panels(accordion, multiple)
    v-expansion-panel(v-for="(feature, index) in features", :key="feature.name + index").powerPanel
      v-expansion-panel-header.pa-3
        slot(v-bind="{ feature }")
          h4.d-inline {{ feature.name }}
          span(v-if="isChoiceNeeded(feature)").op-40.mr-3.text-right Choice Needed
      v-expansion-panel-content.ma-2.text-caption
        CheckList(
          v-if="feature.usage",
          :current="feature.usage.used",
          :maximum="feature.usage.maximum",
          title="Uses",
          @changeSelected="count => $emit('updateCharacter', { currentStats: { featuresTimesUsed: { [feature.name]: count } } })"
        )

        div(v-if="isShowingLevel") #[strong Level:] {{ feature.level }}

        FeatureDetail(:key="feature.hash" :feature="feature", @saveChoiceConfig="(fc) => $emit('saveChoiceConfig', fc)")

        div(v-if="feature.customIndex > -1").d-flex.justify-end
          ConfirmDelete(
            label="Feature",
            :item="feature.name",
            @delete="$emit('deleteFeature', feature)"
          )

        // pre {{ JSON.stringify(feature, null, 4) }}
</template>

<style lang="scss">
  .powerPanel .v-expansion-panel-header {
    min-height: 0 !important;
  }
</style>
