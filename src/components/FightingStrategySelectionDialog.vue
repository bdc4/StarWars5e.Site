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
      VueMarkdown
    }
  })
  export default class FightingStrategySelectionDialog extends Vue {
    @Prop(Object) readonly feature: CompletedFeatureType
    @Prop(Boolean) readonly hidden: boolean

    @fightingStrategiesModule.State fightingStrategies!: FightingStrategyType[]
    @fightingStrategiesModule.Action fetchFightingStrategies!: () => void

    fightingStrategyOptions: FightingStrategyOption[] = []

    created () {
      this.fetchFightingStrategies()
      this.fightingStrategyOptions = this.fightingStrategies.map(fs => ({
        ...fs,
        rowKey: (fs as any).rowKey,
        selected: this.feature.config && this.feature.config.data === (fs as any).rowKey
      } as FightingStrategyOption))
    }

    isOpen = false

    select (fs: any) {
      this.isOpen = false
      setTimeout(() => {
      this.$emit('saveFeatureConfig', {
          data: fs.rowKey,
          featureRowKey: (this.feature as any).rowKey,
          configType: 'FightingStrategyType',
          localId: this.feature.config && this.feature.config.localId ? this.feature.config.localId : undefined
        })
      }, 500)
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
        v-btn(v-if="!feature.config || !feature.config.data", color="primary", v-on="on").mt-3 Choose Fighting Strategy
      div
        a(v-if="feature.config && feature.config.data", v-on="on").mt-3 Change Fighting Strategy
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
