<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import MyDialog from '@/components/MyDialog.vue'
  import MySelect from '@/components/MySelect.vue'
  import { FightingMasteryType } from '@/types/characterTypes'
  import { range } from 'lodash'
  import { namespace } from 'vuex-class'
  import VueMarkdown from 'vue-markdown'
  import { CompleteCharacterType, CompletedFeatureType } from '@/types/completeCharacterTypes'
  import { e } from 'mathjs'

  const fightingMasteriesModule = namespace('fightingMasteries')

  interface FightingMasteryOption {
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
  export default class FightingMasteryChoice extends Vue {
    @Prop(Object) readonly source: CompletedFeatureType
    @Prop(String) readonly sourceType: string

    @fightingMasteriesModule.State fightingMasteries!: FightingMasteryType[]
    @fightingMasteriesModule.Action fetchFightingMasteries!: () => void

    fightingMasteryOptions: FightingMasteryOption[] = []

    created () {
      this.fetchFightingMasteries()
      this.fightingMasteryOptions = this.fightingMasteries.map(fs => ({
        ...fs,
        rowKey: (fs as any).rowKey,
        selected: this.source.config && this.source.config.data === (fs as any).rowKey
      } as FightingMasteryOption))
    }

    isOpen = false

    select (fs: any) {
      this.isOpen = false
      this.$emit('saveChoiceConfig', {
          data: fs,
          referenceRowKey: (this.source as any).rowKey,
          referenceType: this.sourceType,
          configType: 'FightingMasteryType',
          localId: this.source.config && this.source.config.localId ? this.source.config.localId : undefined
        })
    }

    getFightingMastery (key: string | {rowKey: string}) {
      var fs = this.fightingMasteries.find(f => (f as any).rowKey === (typeof (key) === 'string' ? key : key.rowKey))
      if (fs) {
        return fs
      }
      return undefined
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
        v-btn(v-if="!source.config || !source.config.data", color="primary", v-on="on").mt-3 Choose Fighting Mastery
      div(v-if="source.config && source.config.data").mb-5
        h4 {{ getFightingMastery(source.config.data).name }}
        VueMarkdown(:source="getFightingMastery(source.config.data).text")
        a(v-if="source.config && source.config.data", v-on="on").mt-3.mb-5.d-block Change Fighting Mastery
    template(#title) Choose Fighting Mastery
    template(#text)
      v-expansion-panels(accordion, multiple).mt-5
        v-expansion-panel(v-for="(fightingMastery, index) in fightingMasteryOptions", :key="fightingMastery.name + index").powerPanel
          v-expansion-panel-header
            v-btn(
              x-small,
              color="primary",
              @click.stop="select(fightingMastery)"
            ).flex-none.mr-5 Select
            h4 {{ fightingMastery.name }}
          v-expansion-panel-content
            VueMarkdown {{ fightingMastery.text }}
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
