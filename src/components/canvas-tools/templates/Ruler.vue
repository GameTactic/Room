<template>
  <div>
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-switch
          v-model="rulerTemporary"
          :label="rulerTemporary ? 'Temporary' : 'Permanent'"
        ></v-switch>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Tool } from '@/tools/Tool'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'

const Tools = namespace(Namespaces.TOOLS)

@Component({
  name: 'Ruler',
  computed: {}
})
export default class PopoutButton extends Vue {
  @Tools.Getter(ToolGetters.TOOL) findTool!: (name: string) => Tool
  @Tools.Action(ToolsAction.SET_TEMPORARY) setTemporary!: (temporary: boolean) => void

  get rulerTemporary (): boolean {
    return this.findTool('ruler').temporary || false
  }

  set rulerTemporary (newValue: boolean) {
    this.setTemporary(newValue)
  }
}

</script>
<style scoped lang="scss">

</style>
