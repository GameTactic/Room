<template>
  <v-menu
    v-if="popout"
    transition="scale-transition"
    content-class="v-menu-content-class"
    :close-on-content-click="false"
    offset-x
    ref="menu"
  >
    <template v-slot:activator="{ on }">
      <div>
        <v-btn
          icon
          tile
          elevation="2"
          @click="onButtonClickHandler"
        >
          <v-icon dense>{{icon}}</v-icon>
        </v-btn>
        <v-btn
          x-small
          class="tools-caret-down"
          icon
          elevation="0"
          tile
          absolute
          v-on="on"
          @click="onButtonClickHandler"
        >
          <v-icon color="white" x-small>{{ getIsActive() ? 'fa-chevron-right' : 'fa-chevron-left'}}</v-icon>
        </v-btn>
      </div>
    </template>
    <v-sheet>
      <slot>Default Content For Slot</slot>
    </v-sheet>
  </v-menu>
  <v-btn
    v-else
    icon
    elevation="2"
    @click="onButtonClickHandler"
  >
    <v-icon dense>{{icon}}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Tool } from '../../tools/Tool'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'

const Tools = namespace(Namespaces.TOOLS)

  @Component({
    name: 'ToolContainer'
  })
export default class ToolContainer extends Vue {
    @Prop() private id!: string
    @Prop() private icon!: string
    @Prop() private popout!: boolean
    @Prop() private toolname!: string
    @Tools.Action(ToolsAction.ENABLE_TOOL) enableTool!: (toolName: string) => void
    @Tools.Getter(ToolGetters.ENABLED_TOOL) enabledTool?: Tool
    @Tools.Action(ToolsAction.DISABLE_TOOL) disableTool!: (toolName: string) => void

    getIsActive () {
      const menu = this.$refs['menu']
      if (menu) {
        return !menu.isActive
      } else {
        return true
      }
    }

    onButtonClickHandler () {
      if (this.enabledTool?.name !== this.toolname) {
        this.enableTool(this.toolname)
      } else {
        this.disableTool(this.toolname)
      }
    }
}

</script>
<style scoped lang="scss">
  .v-menu-content-class {
    margin-left: 20px;
    box-shadow: 0px 4px 4px -3px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
  }
  .tools-caret-down {
    margin-top:3px;
    border-radius: 0px 8px 8px 0px;
    width:14px;
    height: 44px;
    background-color:#24292e;
    color: white;
    transition:0.2s ease-in-out;
  }
  .rotate90 {
    transform: rotate(-90deg);
  }
</style>
