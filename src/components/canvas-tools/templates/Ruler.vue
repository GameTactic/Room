<template>
  <v-card class="flex-fill">
    <v-card-actions row class="pb-0 px-2">
      <v-spacer></v-spacer>
      <v-switch
        v-model="rulerTemporary"
        class="mt-0 pr-12"
        :label="rulerTemporary ? $t('tool.template.permanent') : $t('tool.template.temporary')"
      ></v-switch>
      <v-spacer></v-spacer>
      <v-switch
        v-model="rulerShowCircle"
        class="mt-0"
        :label="rulerShowCircle ? $t('tool.container.circle') : $t('tool.container.line')"
      ></v-switch>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Tool } from '@/tools/Tool'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { AppToolGetters, AppToolsAction } from '@/store/modules/app/tools'

const AppTools = namespace(Namespaces.APP_TOOLS)

@Component({
  name: 'Ruler'
})
export default class PopoutButton extends Vue {
  @AppTools.Getter(AppToolGetters.TOOL) findTool!: (name: string) => Tool
  @AppTools.Action(AppToolsAction.SET_TEMPORARY) setTemporary!: (temporary: boolean) => void
  @AppTools.Action(AppToolsAction.SET_SHOW_CIRCLE) setShowCircle!: (showCircle: boolean) => void

  get rulerTemporary (): boolean {
    return !this.findTool('ruler').temporary || false
  }

  set rulerTemporary (newValue: boolean) {
    this.setTemporary(!newValue)
  }

  get rulerShowCircle (): boolean {
    return this.findTool('ruler').showCircle || false
  }

  set rulerShowCircle (newValue: boolean) {
    this.setShowCircle(newValue)
  }
}

</script>
<style scoped lang="scss">

</style>
