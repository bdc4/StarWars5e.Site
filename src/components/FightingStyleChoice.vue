<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import MyDialog from '@/components/MyDialog.vue'
  import MySelect from '@/components/MySelect.vue'
  import { FightingStyleType } from '@/types/characterTypes'
  import { range } from 'lodash'
  import { namespace } from 'vuex-class'
  import VueMarkdown from 'vue-markdown'
  import { CompleteCharacterType, CompletedFeatureType } from '@/types/completeCharacterTypes'
  import { e } from 'mathjs'

  const fightingStylesModule = namespace('fightingStyles')

  interface FightingStyleOption {
    selected: boolean,
    name: string,
    description: string,
    rowKey: string
  }

  @Component({
    components: {
      MyDialog,
      MySelect,
      VueMarkdown
    }
  })
  export default class FightingStyleChoice extends Vue {
    @Prop(Object) readonly source: CompletedFeatureType
    @Prop(String) readonly sourceType: string

    @fightingStylesModule.State fightingStyles!: FightingStyleType[]
    @fightingStylesModule.Action fetchFightingStyles!: () => void

    fightingStyleOptions: FightingStyleOption[] = []

    created () {
      this.fetchFightingStyles()
      this.fightingStyleOptions = this.fightingStyles.map(fs => ({
        ...fs,
        rowKey: (fs as any).rowKey,
        selected: this.source.config && this.source.config.data === (fs as any).rowKey
      } as FightingStyleOption))
    }

    isOpen = false

    getFightingStyle (key: string | {rowKey: string}) {
      var fs = this.fightingStyles
        .find(f => (f as any).rowKey === (typeof (key) === 'string' ? key : key.rowKey))
      if (fs) {
        return fs
      }
      return undefined
    }

    select (fs: any) {
      this.isOpen = false
      this.$emit('saveChoiceConfig', {
          data: fs,
          referenceRowKey: (this.source as any).rowKey,
          referenceType: this.sourceType,
          configType: 'FightingStyleType',
          localId: this.source.config && this.source.config.localId ? this.source.config.localId : undefined
        })
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
        v-btn(v-if="!source.config || !source.config.data", color="primary", v-on="on").mt-3 Choose Fighting Style
      div(v-if="source.config && source.config.data")
        h4 {{ getFightingStyle(source.config.data).name }}
        VueMarkdown(:source="getFightingStyle(source.config.data).description")
        a(v-if="source.config && source.config.data", v-on="on").mt-3.mb-5 Change Fighting Style
    template(#title) Choose Fighting Style
    template(#text)
      v-expansion-panels(accordion, multiple).mt-5
        v-expansion-panel(v-for="(fightingStyle, index) in fightingStyleOptions", :key="fightingStyle.name + index").powerPanel
          v-expansion-panel-header
            v-btn(
              x-small,
              color="primary",
              @click.stop="select(fightingStyle)"
            ).flex-none.mr-5 Select
            h4 {{ fightingStyle.name }}
          v-expansion-panel-content
            VueMarkdown {{ fightingStyle.description }}
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
