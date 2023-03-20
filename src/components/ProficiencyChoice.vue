<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import MyDialog from '@/components/MyDialog.vue'
  import MySelect from '@/components/MySelect.vue'
  import { property, range } from 'lodash'
  import { namespace } from 'vuex-class'
  import VueMarkdown from 'vue-markdown'
  import { CompleteCharacterType, CompletedFeatureType } from '@/types/completeCharacterTypes'
  import { e } from 'mathjs'
  import Equipment from '@/modules/equipment'
  import { EquipmentType } from '@/types/lootTypes'
  import { ProficiencyType } from '@/types/rawCharacterTypes'

  const equipmentModule = namespace('equipment')

  interface ProficiencyOption {
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
  export default class ProficiencyChoice extends Vue {
    @Prop(Object) readonly source: CompletedFeatureType
    @Prop(String) readonly sourceType: string
    @Prop(String) readonly proficiencyType: ProficiencyType

    @equipmentModule.State equipment!: EquipmentType[]
    @equipmentModule.Action fetchEquipment!: () => void

    proficiencyOptions: ProficiencyOption[] = []

    created () {
      this.fetchEquipment()
      this.proficiencyOptions = this.equipment
      .filter(e => (e.equipmentCategory || '').toLowerCase() === (this.proficiencyType || '').toLowerCase())
      .map(fs => ({
        ...fs,
        rowKey: (fs as any).rowKey,
        selected: this.source.config && this.source.config.data === (fs as any).rowKey
      } as ProficiencyOption))
    }

    isOpen = false

    getToolsProficiencies (key: string | {rowKey: string}) {
      var fs = this.equipment
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
          configType: 'ToolsProficienciesType',
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
        v-btn(v-if="!source.config || !source.config.data", color="primary", v-on="on").mt-3 Choose Proficiency
      div(v-if="source.config && source.config.data")
        h4 {{ getToolsProficiencies(source.config.data).name }}
        VueMarkdown {{ getToolsProficiencies(source.config.data).description || ''}}
        a(v-if="source.config && source.config.data", v-on="on").mt-3.mb-5 Change Proficiency
    template(#title) Choose Proficiency
    template(#text)
      v-expansion-panels(accordion, multiple).mt-5
        v-expansion-panel(v-for="(p, index) in proficiencyOptions", :key="p.name + index").powerPanel
          v-expansion-panel-header
            v-btn(
              x-small,
              color="primary",
              @click.stop="select(p)"
            ).flex-none.mr-5 Select
            h4 {{ p.name }}
          v-expansion-panel-content
            VueMarkdown {{ p.description || p.text || '' }}
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
