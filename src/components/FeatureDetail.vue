<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { startCase } from 'lodash'
  import { CompletedFeatureType } from '@/types/completeCharacterTypes'
  import FightingStyleChoice from './FightingStyleChoice.vue'
  import FightingStrategyChoice from './FightingStrategyChoice.vue'
  import VueMarkdown from 'vue-markdown'
  import FightingMasteryChoice from './FightingMasteryChoice.vue'

  @Component({
    components: {
      FightingStrategyChoice,
      FightingStyleChoice,
      FightingMasteryChoice,
      VueMarkdown
    }
  })
  export default class FeatureDetail extends Vue {
    @Prop(Object) readonly feature!: CompletedFeatureType
    @Prop(Boolean) readonly showName!: boolean
  }
</script>

<template lang="pug">
div.text-left
  h4(v-if="showName") {{feature.name}}
  div(v-if="feature.forceAlignment") #[strong Alignment:] {{ feature.forceAlignment }}
  div(v-if="feature.type") #[strong Type:] {{ feature.type}}
  div(v-if="feature.castingPeriodText") #[strong Casting Time:] {{ feature.castingPeriodText }}
  div(v-if="feature.range") #[strong Range:] {{ feature.range }}
  div(v-if="feature.duration") #[strong Duration:] {{ feature.duration }} {{ feature.concentration ? '(Concentration)' : ''}}
  div(v-if="feature.prerequisite") #[strong Prerequisite:] {{ feature.prerequisite }}
  br(v-if="feature.castingPeriodText || feature.range || feature.duration")
  VueMarkdown(:key="feature.description || feature.text") {{ feature.description || feature.text }}

  // Fighting Styles
  div(v-if="feature.metadata && feature.metadata.fightingStyle")
    FightingStyleChoice(:key="feature.config ? feature.config.hash : ''", :source="feature", sourceType="FeatureType", @saveChoiceConfig="(fc) => $emit('saveChoiceConfig', fc)")

  // Fighting Strategies
  div(v-if="feature.metadata && feature.metadata.fightingStrategy")
    FightingStrategyChoice(:key="feature.config ? feature.config.hash : ''", :source="feature", sourceType="FeatureType", @saveChoiceConfig="(fc) => $emit('saveChoiceConfig', fc)")

  // Fighting Masteries
  div(v-if="feature.metadata && feature.metadata.fightingMastery")
    FightingMasteryChoice(:key="feature.config ? feature.config.hash : ''", :source="feature", sourceType="FeatureType", @saveChoiceConfig="(fc) => $emit('saveChoiceConfig', fc)")

  // pre {{JSON.stringify(feature, null, 4)}}
</template>
