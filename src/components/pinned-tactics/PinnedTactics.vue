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
          class="custom-pinned-tab px-2"
          @click="switchTactic(pinnedTactic.id)"
          @contextmenu="showTacticTabContextMenu(pinnedTactic, $event)"
        >
          <span class="custom-pinned-tactic-content">
            <div class="caption" v-text="pinnedTactic.name" />
            <v-icon
              class="ml-1"
              small
              :title="$t('tactic.unpin')"
              @click="togglePinTactic(pinnedTactic)"
            >
              fa-times
            </v-icon>
          </span>
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

const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)

@Component({
  name: 'PinnedTactics'
})

export default class PinnedTactics extends Vue {
  @SocketTactic.Getter(SocketTacticGetters.TACTICS) tactics!: Tactic[]
  @SocketTactic.Getter(SocketTacticGetters.CURRENT_TACTIC) currentTactic!: Tactic | undefined
  @SocketTactic.Action(SocketTacticAction.TOGGLE_PIN_TACTIC) togglePinTactic!: (tactic: Tactic) => void

  showMenu = false
  x = 0
  y = 0

  get currentTabValue () {
    return this.currentTactic?.isPinned ? `tab-'${this.currentTactic.id}` : ''
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
    margin: 0;
  }
  .custom-pinned-tab {
    width: 200px;
    overflow-x: hidden;
    align-items: flex-start;
    padding-top: 2px;
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
    display: flex;
  }
  .custom-pinned-tactic-content {
    display: flex;
    width: 100%;
    justify-content: space-between;
    overflow: hidden;
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
