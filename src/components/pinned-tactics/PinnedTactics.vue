<template>
  <v-tabs
    :class="['custom-tactic-tabs', 'd-none d-sm-flex', pinnedTactics.length ? 'custom-tactic-pinned-tabs' : '']"
    prev-icon="fa-chevron-left"
    next-icon="fa-chevron-right"
    height="40"
    show-arrows
    icons-and-text
  >
    <v-tabs-slider color="primary" />
    <v-menu
      v-for="pinnedTactic in pinnedTactics"
      :key="pinnedTactic.id"
      content-class="elevation-1"
      z-index="100"
      open-on-hover
      top
      offset-y
    >
      <template v-slot:activator="{ on: pinnedTab }">
        <v-tab :href="`#tab-'${pinnedTactic.id}`" v-on="pinnedTab">
          <div class="caption" v-text="pinnedTactic.name" />
        </v-tab>
      </template>
      <v-card tile flat>
        <div class="d-flex flex-column align-center">
          <v-img
            :src="pinnedTactic.map.icon"
            :alt="'Image of ' + pinnedTactic.map.name"
            width="80"
            eager
            class="custom-pinned-tactic-popup"
          />
          <div class="caption" v-text="pinnedTactic.name" />
          <div class="caption" v-text="pinnedTactic.map.name" />
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
import { SocketTacticGetters } from '@/store/modules/socket/tactic'
import { Tactic } from '@/store/types'

const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)

@Component({
  name: 'PinnedTactics'
})

export default class PinnedTactics extends Vue {
  @SocketTactic.Getter(SocketTacticGetters.TACTICS) tactics!: Tactic[]
  @SocketTactic.Getter(SocketTacticGetters.CURRENT_TACTIC_ID) currentTacticId!: string

  get pinnedTactics (): Tactic[] {
    return this.tactics.filter((tactic: Tactic) => tactic.isPinned)
  }
}
</script>

<style scoped lang="scss">
  .custom-tactic-tabs {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .custom-pinned-tactic-popup {
    border-radius: 50%;
    margin-top: 0.5rem;
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
