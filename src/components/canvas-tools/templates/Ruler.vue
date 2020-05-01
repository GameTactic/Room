<template>
  <v-card class="flex-fill">
    <v-card-actions row class="pb-0 px-2">
      <v-spacer></v-spacer>
      <v-switch
        v-model="rulerTemporary"
        class="mt-0 pr-12"
        :label="rulerTemporary ? 'Permanent' : 'Temporary'"
      ></v-switch>
      <v-spacer></v-spacer>
      <v-switch
        v-model="rulerShowCircle"
        class="mt-0"
        :label="rulerShowCircle ? 'Circle' : 'Line'"
      ></v-switch>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ToolInterface } from '@/tools/Tool'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'

const Tools = namespace(Namespaces.TOOLS)

@Component({
  name: 'Ruler',
  computed: {}
})
export default class PopoutButton extends Vue {
  @Tools.Getter(ToolGetters.TOOL) findTool!: (name: string) => ToolInterface
  @Tools.Action(ToolsAction.SET_TEMPORARY) setTemporary!: (temporary: boolean) => void
  @Tools.Action(ToolsAction.SET_SHOW_CIRCLE) setShowCircle!: (showCircle: boolean) => void

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
