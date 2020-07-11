<template>
  <v-tabs
    :value="currentTabValue"
    :class="['custom-tactic-tabs', 'd-none d-sm-flex', pinnedTactics.length ? 'custom-tactic-pinned-tabs' : '']"
    prev-icon="fa-chevron-left"
    next-icon="fa-chevron-right"
    height="30"
    slider-size="3"
    show-arrows
    icons-and-text
  >
    <v-tabs-slider color="primary" />
    <v-menu
      v-for="pinnedTactic in pinnedTactics"
      :key="pinnedTactic.id"
      content-class="elevation-3"
      z-index="100"
      open-on-hover
      top
      offset-y
    >
      <template v-slot:activator="{ on: pinnedTab }">
        <v-tab class="pa-0 ma-0" style="min-width:0px" />
        <v-tab
          :href="`#tab-'${pinnedTactic.id}`"
          :title="pinnedTactic.name"
          v-on="pinnedTab"
          class="custom-pinned-tab"
          @click="switchTactic(pinnedTactic.id)"
          @contextmenu="showTacticTabContextMenu(pinnedTactic, $event)"
        >
          <div class="caption" v-text="pinnedTactic.name" />
        </v-tab>
      </template>
      <v-card
        tile
        flat
        class="custom-pinned-tab-card"
        @click="switchTactic(pinnedTactic.id)"
      >
        <div class="d-flex flex-column align-center">
          <v-img
            :src="pinnedTactic.map.icon"
            :alt="'Image of ' + pinnedTactic.map.name"
            width="200"
            eager
            class="custom-pinned-tactic-popup"
          />
        </div>
      </v-card>
    </v-menu>
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list dense>
        <v-list-item
          v-for="(contextMenuItem, index) in contextMenuItems"
          :key="index"
          @click="tacticMenuOnClickHandler(contextMenuItem)"
        >
          <v-list-item-icon class="custom-autocomplete-tactic-menu-icon">
            <v-icon
              color="primary"
              small
              v-text="contextMenuItem.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title :title="$t(contextMenuItem.title)" v-text="$t(contextMenuItem.title)" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-tabs>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { SocketTacticGetters, SocketTacticAction } from '@/store/modules/socket/tactic'
import { Tactic } from '@/store/types'
import HandleTactic from '@/util/handleTactic'
import { MenuItem, TacticMenuOptions } from '../entity-panel/types'

const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)

@Component({
  name: 'PinnedTactics'
})

export default class PinnedTactics extends Vue {
  @SocketTactic.Getter(SocketTacticGetters.TACTICS) tactics!: Tactic[]
  @SocketTactic.Getter(SocketTacticGetters.CURRENT_TACTIC) currentTactic!: Tactic | undefined
  @SocketTactic.Action(SocketTacticAction.TOGGLE_PIN_TACTIC) togglePinTactic!: (tactic: Tactic) => void

  selectedTactic: Tactic | null = null
  showMenu = false
  x = 0
  y = 0
  contextMenuItems: MenuItem[] = [{
    action: TacticMenuOptions.PIN,
    title: 'tactic.unpin',
    icon: 'far fa-bookmark'
  }]

  get currentTabValue () {
    return this.currentTactic?.isPinned ? `tab-'${this.currentTactic.id}` : ''
  }

  showTacticTabContextMenu (tactic: Tactic, event: MouseEvent) {
    event.preventDefault()
    this.selectedTactic = tactic
    this.showMenu = false
    this.x = event.clientX
    this.y = event.clientY
    this.$nextTick(() => {
      this.showMenu = true
    })
  }

  get pinnedTactics (): Tactic[] {
    return this.tactics.filter((tactic: Tactic) => tactic.isPinned).sort((a: Tactic, b: Tactic) => a.name > b.name ? 1 : -1)
  }

  switchTactic (id: string) {
    const tactic: Tactic | undefined = this.tactics.find((tactic: Tactic) => tactic.id === id)
    if (tactic) {
      new HandleTactic(tactic).setLocal()
    }
  }

  tacticMenuOnClickHandler (contextMenuItem: MenuItem) {
    if (this.selectedTactic) {
      switch (contextMenuItem.action) {
        case TacticMenuOptions.PIN:
          this.togglePinTactic(this.selectedTactic)
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .custom-tactic-tabs {
    position: fixed;
    bottom: 0;
    left: 12px;
    width: 100%;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .custom-pinned-tactic-popup {
    margin: 0px;
  }
  .custom-pinned-tab {
    width: 200px;
    overflow-x: hidden;
    align-items: flex-start;
    border-right: 1.5px solid rgba(0, 0, 0, 0.1);
    > div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
  .custom-pinned-tab-card {
    width: 200px;
    justify-content: center;
    display: flex;;
  }

  .custom-autocomplete-tactic-menu-icon {
    margin-right: 6px !important;
  }
</style>
<style lang="scss">
  .custom-tactic-pinned-tabs > div {
    position: relative;
    border-top: 1.5px solid rgba(0, 0, 0, 0.1);
  }
  .custom-tactic-tabs > div {
    border-right: 1.5px solid rgba(0, 0, 0, 0.1);
  }
</style>
