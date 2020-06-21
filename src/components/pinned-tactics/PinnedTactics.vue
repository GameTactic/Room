<template>
  <v-tabs
    :class="['custom-tactic-tabs', 'd-none d-sm-flex', pinnedTactics.length ? 'custom-tactic-pinned-tabs' : '']"
    next-icon="fa-arrow-right"
    prev-icon="fa-arrow-left"
    height="42"
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
    left: 50%;
    width: auto;
    max-width: 80%;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .custom-pinned-tactic-popup {
    border-radius: 50%;
    margin-top: 0.5rem;
  }
</style>
<style lang="scss">
  @mixin pinnedTabSlants {
    content: "";
    position: absolute;
    height: 100%;
    -webkit-transform-origin: 100% 0;
    transform-origin: 100% 0;
    z-index: -1;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    background: white;
    width: 60px;
  }
  .custom-tactic-pinned-tabs > div {
    position: relative;
    left: -50%;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    &::after {
      @include pinnedTabSlants;
      right: 0px;
      -webkit-transform: skew(45deg);
      transform: skew(45deg);
      border-right: 1.5px solid rgba(0, 0, 0, 0.05);
    }
    &::before {
      @include pinnedTabSlants;
      left: 0px;
      -webkit-transform: skew(-45deg);
      transform: skew(-45deg);
      border-left: 1.5px solid rgba(0, 0, 0, 0.05);
    }
  }
</style>
