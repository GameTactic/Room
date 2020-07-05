<template>
  <v-menu
    v-if="popout"
    transition="scale-transition"
    content-class="ml-8 elevation-2"
    :close-on-content-click="false"
    offset-x
    ref="menu"
  >
    <template v-slot:activator="{ on: menu }">
      <div>
        <v-tooltip
          right
          nudge-right="10"
          :open-delay="500"
        >
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              :class="[isEnabledClass, 'border-btn']"
              icon
              tile
              :disabled="!isAuthorisedCanvasLoaded"
              v-on="tooltip"
              elevation="0"
              @click="onButtonClickHandler"
            >
              <v-icon dense :color="iconColour">{{icon}}</v-icon>
            </v-btn>
          </template>
          <span>{{ $t(`tool.container.${toolName}`) }}</span>
        </v-tooltip>
        <v-btn
          x-small
          :class="['tools-caret-down', isEnabledButtonClass]"
          icon
          v-if="isAuthorisedCanvasLoaded"
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
      <slot />
    </v-sheet>
  </v-menu>
  <v-tooltip
    v-else
    right
    nudge-right="10"
    :open-delay="500"
  >
    <template v-slot:activator="{ on: tooltip1 }">
      <v-btn
        :class="[isEnabledClass, 'border-btn']"
        icon
        :disabled="!isAuthorisedCanvasLoaded"
        tile
        elevation="0"
        v-on="tooltip1"
        @click="onButtonClickHandler"
      >
        <v-icon dense :color="iconColour">{{icon}}</v-icon>
      </v-btn>
    </template>
    <span>{{ $t(`tool.container.${toolName}`) }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Tool } from '@/tools/tool'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { AppToolGetters, AppToolsAction } from '@/store/modules/app/tools'
import { SocketUserGetters } from '@/store/modules/socket/user'

const AppTools = namespace(Namespaces.APP_TOOLS)
const SocketUser = namespace(Namespaces.SOCKET_USER)

interface MenuElement extends Vue {
  isActive: boolean;
}

@Component({
  name: 'ToolContainer'
})
export default class ToolContainer extends Vue {
  @Prop() private icon!: string
  @Prop() private popout!: boolean
  @Prop() private toolName!: string
  @AppTools.Getter(AppToolGetters.ENABLED_TOOL) enabledTool?: Tool
  @SocketUser.Getter(SocketUserGetters.IS_AUTHORISED_CANVAS_LOADED) isAuthorisedCanvasLoaded!: boolean;
  @AppTools.Action(AppToolsAction.ENABLE_TOOL) enableTool!: (toolName: string) => void
  @AppTools.Action(AppToolsAction.DISABLE_TOOL) disableTool!: () => void

  isActive = false

  getIsActive (): boolean {
    const menu = this.$refs['menu'] as MenuElement
    if (menu) {
      this.isActive = menu.isActive
    }
    return this.isActive
  }

  get iconColour (): string {
    return (this.enabledTool?.name === this.toolName) ? 'white' : 'primary'
  }

  get isEnabledClass (): string {
    return (this.enabledTool?.name === this.toolName) ? 'v-btn--active' : 'custom-btn-disabled'
  }

  get isEnabledButtonClass (): string {
    if (this.isActive) {
      return 'px-3'
    } else {
      return 'px-0'
    }
  }

  onButtonClickHandler () {
    if (this.enabledTool?.name !== this.toolName) {
      this.enableTool(this.toolName)
    } else {
      this.disableTool()
    }
  }

  onButtonClickHandlerCaret () {
    if (this.enabledTool?.name !== this.toolName) {
      this.enableTool(this.toolName)
    }
  }
}
</script>
<style scoped lang="scss">
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

.custom-btn-disabled {
  background-color: rgba(0, 0, 0, 0);
  .v-icon {
    color: var(--v-primary-base) !important; // override
  }

  &::before {
    opacity: 0;
  }
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
<style lang="scss">
.custom-hide-text {
  display: block;
}

@media screen and (max-height: 450px) {
  .custom-hide-text {
    display: none;
  }
}
</style>
