<template>
  <v-menu
    v-if="popout"
    transition="scale-transition"
    content-class="v-menu-content-class"
    :close-on-content-click="false"
    offset-x
    ref="menu"
  >
    <template v-slot:activator="{ on: menu }">
      <div>
        <v-tooltip right nudge-right="10">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              :class="[isEnabledClass, 'border-btn']"
              icon
              tile
              v-on="tooltip"
              elevation="0"
              @click="onButtonClickHandler"
            >
              <v-icon dense :color="iconColour">{{icon}}</v-icon>
            </v-btn>
          </template>
          <span>{{ toolName }}</span>
        </v-tooltip>
        <v-btn
          x-small
          :class="['tools-caret-down', isEnabledButtonClass]"
          icon
          elevation="0"
          tile
          absolute
          v-on="menu"
          @click="onButtonClickHandlerCaret"
        >
          <v-icon color="white" x-small>{{ getIsActive() ? 'fa-chevron-left' : 'fa-chevron-right'}}</v-icon>
        </v-btn>
      </div>
    </template>
    <v-sheet>
      <slot>Default Content For Slot</slot>
    </v-sheet>
  </v-menu>
  <v-tooltip right v-else nudge-right="10">
    <template v-slot:activator="{ on: tooltip1 }">
      <v-btn
        :class="[isEnabledClass, 'border-btn']"
        icon
        tile
        elevation="0"
        v-on="tooltip1"
        @click="onButtonClickHandler"
      >
        <v-icon dense :color="iconColour">{{icon}}</v-icon>
      </v-btn>
    </template>
    <span>{{ toolName }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Tool } from '../../tools/Tool'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'

const Tools = namespace(Namespaces.TOOLS)

@Component({
  name: 'ToolContainer',
  data: function () {
    return {
      isActive: false
    }
  }
})
export default class ToolContainer extends Vue {
  @Prop() private id!: string
  @Prop() private icon!: string
  @Prop() private popout!: boolean
  @Prop() private toolname!: string
  @Tools.Action(ToolsAction.ENABLE_TOOL) enableTool!: (toolName: string) => void
  @Tools.Action(ToolsAction.DISABLE_TOOL) disableTool!: () => void
  @Tools.Getter(ToolGetters.ENABLED_TOOL) enabledTool?: Tool

  getIsActive (): boolean {
    const menu = this.$refs['menu'] as MenuElement
    if (menu) {
      this.$data.isActive = menu.isActive
    }
    return this.$data.isActive
  }

  get toolName (): string {
    return this.toolname.charAt(0).toUpperCase() + this.toolname.slice(1)
  }

  get iconColour (): string {
    return (this.enabledTool?.name === this.toolname) ? 'white' : 'primary'
  }

  get isEnabledClass (): string {
    return (this.enabledTool?.name === this.toolname) ? 'v-btn--active' : 'custom-btn-disabled'
  }

  get isEnabledButtonClass (): string {
    if (this.$data.isActive) {
      return 'px-3'
    } else {
      return 'px-0'
    }
  }

  onButtonClickHandler () {
    if (this.enabledTool?.name !== this.toolname) {
      this.enableTool(this.toolname)
    } else {
      this.disableTool()
    }
  }

  onButtonClickHandlerCaret () {
    if (this.enabledTool?.name !== this.toolname) {
      this.enableTool(this.toolname)
    }
  }
}

interface MenuElement extends Vue {
  isActive: boolean;
}

</script>
<style scoped lang="scss">
.v-menu-content-class {
  margin-left: 30px;
  box-shadow: 0px 4px 4px -3px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}
.tools-caret-down-active {
  width:24px;
}
.tools-caret-down {
  margin-top:3px;
  border-radius: 0px 8px 8px 0px;
  width:14px;
  height: 44px;
  background-color: $room-primary;
  color: white;
  transition:0.2s ease-in-out;
}
.rotate90 {
  transform: rotate(-90deg);
}
.v-btn--active {
  background-color: $room-primary;
}
.custom-btn-disabled::before {
  opacity: 0;
}
.custom-btn-disabled {
  background-color: rgba(0, 0, 0, 0);
}
.custom-btn-disabled .v-icon {
  color: var(--v-primary-base) !important; // override
}
.border-btn {
  border-color: rgba(0, 0, 0, 0.12);
  border-style:solid;
  border-radius: 0;
  border-width:0.4px 1.5px 0.5px 1.5px !important; // override
}
</style>
