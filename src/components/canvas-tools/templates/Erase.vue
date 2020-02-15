<template>
  <div>
    <v-slider
      prepend-icon="fa-ruler-vertical"
      :hint="eraserSizeHint"
      v-model="eraserSize"
      :max="6"
      :step="1"
      ticks="always"
      style="width: 281px"
    />
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
  name: 'Erase',
  computed: {}
})
export default class PopoutButton extends Vue {
  @Tools.Getter(ToolGetters.TOOL) findTool!: (name: string) => Tool
  @Tools.Action(ToolsAction.SET_SIZE) setSize!: (size: number) => void

  get eraserSizeHint (): string {
    return `Size: ${this.eraserSize}`
  }

  get eraserSize () {
    return this.findTool('erase').size
  }

  set eraserSize (newValue: number) {
    this.setSize(newValue)
  }
}

</script>
<style scoped lang="scss">

</style>
