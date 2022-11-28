<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import MyDialog from '@/components/MyDialog.vue'
  import MySelect from '@/components/MySelect.vue'
  import { FightingStrategyType } from '@/types/characterTypes'
  import { range } from 'lodash'
  import { namespace } from 'vuex-class'
  import VueMarkdown from 'vue-markdown'
  import { CompleteCharacterType, CompletedFeatureType } from '@/types/completeCharacterTypes'
  import { e } from 'mathjs'
  import FightingMasteryChoice from './FightingMasteryChoice.vue'
  import { ChoiceConfigType } from '@/types/rawCharacterTypes'

  const fightingStrategiesModule = namespace('fightingStrategies')

  interface FightingStrategyOption {
    selected: boolean,
    name: string,
    text: string,
    rowKey: string
  }

  @Component({
    components: {
      MyDialog,
      MySelect,
      VueMarkdown,
      FightingMasteryChoice
    }
  })
  export default class FightingStrategyChoice extends Vue {
    @Prop(Object) readonly source: CompletedFeatureType
    @Prop(String) readonly sourceType: string

    @fightingStrategiesModule.State fightingStrategies!: FightingStrategyType[]
    @fightingStrategiesModule.Action fetchFightingStrategies!: () => void

    fightingStrategyOptions: FightingStrategyOption[] = []

    created () {
      this.fetchFightingStrategies()
      this.fightingStrategyOptions = this.fightingStrategies.map(fs => ({
        ...fs,
        rowKey: (fs as any).rowKey,
        selected: this.source.config && this.source.config.data === (fs as any).rowKey
      } as FightingStrategyOption))
    }

    isOpen = false

    select (fs: any) {
      this.isOpen = false
      this.$emit('saveChoiceConfig', {
          data: fs,
          referenceRowKey: (this.source as any).rowKey,
          referenceType: this.sourceType,
          configType: 'FightingStrategyType',
          localId: this.source.config && this.source.config.localId ? this.source.config.localId : undefined
        })
      setTimeout(() => this.$forceUpdate(), 500)
    }

    getFightingStrategy (key: string | {rowKey: string}) {
      var fs = this.fightingStrategies
        .find(f => (f as any).rowKey === (typeof (key) === 'string' ? key : key.rowKey))
      if (fs) {
        return fs
      }
      return undefined
    }

    handleMasteryChosen (choiceConfig: ChoiceConfigType) {
      if (this.source.config) {
        this.source.config.data.config = choiceConfig
        this.$emit('saveChoiceConfig', this.source.config)
      }
    }

    finish () {
      // this.$emit('updateCharacter', { customFeats: { [this.numCustomFeats]: this.selected } })
      this.isOpen = false
    }
  }
</script>

<template lang="pug">
  MyDialog(v-model="isOpen", wide)
    template(v-slot:activator="{ on }")
      div
        v-btn(v-if="!source.config || !source.config.data", color="primary", v-on="on").mt-3 Choose Fighting Strategy
      div(v-if="source.config && source.config.data")
        h4 {{ getFightingStrategy(source.config.data).name }}
        VueMarkdown(:source="getFightingStrategy(source.config.data).text")
        a(v-if="source.config && source.config.data", v-on="on").mt-3.mb-5.d-block Change Fighting Strategy
        div(v-if="source.config.data && source.config.data.metadata && source.config.data.metadata.fightingMastery")
          hr
          FightingMasteryChoice(:key="source.config.hash", :source="source.config.data", sourceType="FightingStrategyType",
            @saveChoiceConfig="(fc) => handleMasteryChosen(fc)")
    template(#title) Choose Fighting Strategy
    template(#text)
      v-expansion-panels(accordion, multiple).mt-5
        v-expansion-panel(v-for="(fightingStrategy, index) in fightingStrategyOptions", :key="fightingStrategy.name + index").powerPanel
          v-expansion-panel-header
            v-btn(
              x-small,
              color="primary",
              @click.stop="select(fightingStrategy)"
            ).flex-none.mr-5 Select
            h4 {{ fightingStrategy.name }}
          v-expansion-panel-content
            VueMarkdown {{ fightingStrategy.text }}
    template(#actions)
      v-spacer
      v-btn(color="primary", text, @click="isOpen=false") Close
</template>

<style lang="scss" module>
  .checkbox {
    flex: none !important;
    margin-top: 0 !important;
  }
</style>
