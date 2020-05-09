<template>
  <v-menu
    transition="slide-y-reverse-transition"
    :close-on-content-click="false"
    :close-on-click="false"
    offset-y
    style="ml-2"
    top
    ref="tactic"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :class="['custom-tactic-selector-menu']"
        color="primary"
        ripple
        tile
        icon
        x-large
        v-on="on"
        elevation="0"
        @click="onButtonClickHandler"
      >
        <v-icon dense class="mr-1">fa-layer-group</v-icon>
      </v-btn>
    </template>
    <v-card tile>
      <v-sheet class="pa-2 primary d-flex" tile>
        <v-btn icon color="white" class="pa-2 mr-2">
          <v-icon>fa-cog</v-icon>
        </v-btn>
        <v-text-field
          v-model="search"
          label="Search Tactics"
          dark
          dense
          flat
          tile
          full-width
          solo-inverted
          hide-details
          clearable
        ></v-text-field>
        <v-btn icon color="white" class="pa-2 ml-2">
          <v-icon>fa-plus</v-icon>
        </v-btn>
      </v-sheet>
      <v-treeview
        v-if="tactics.length"
        :items="tactics"
        :search="search"
        :filter="filter"
        :open.sync="open"
      >
        <template v-slot:prepend="{ item }">
          <v-icon
            v-if="item.children"
            v-text="`fa-${item.id === 1 ? 'home-variant' : 'folder-network'}`"
          ></v-icon>
        </template>
      </v-treeview>
      <v-sheet
        v-else
      >
        <v-subheader>You have created no tactics</v-subheader>
      </v-sheet>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Tool } from '../../tools/Tool'
import { namespace, Getter } from 'vuex-class'
import { RoomGetters } from '@/store/modules/room'
import { Tactic } from '../../store/modules/types'

@Component({
  name: 'TheTacticSelector',
  data: function () {
    return {
      open: [],
      search: null
    }
  }
})
export default class TheTacticSelector extends Vue {
  @Prop() private id!: string
  @Prop() private icon!: string
  @Getter(`room/${RoomGetters.TACTICS}`) tactics!: Tactic[]

  filter () {
    return (tactic: Tactic, search: string, textKey: string) => tactic.name.toLowerCase().indexOf(search) > -1
  }

  onButtonClickHandler () {
    // content
  }
}

</script>
<style scoped lang="scss">
.custom-tactic-selector-menu {
  position: fixed;
  bottom: 0px;
  left: 0px;
  border-top-right-radius: 4px;
  background-color: white;
  border: 2px solid rgba(0, 0, 0, 0.12);
}

div[role="menu"] {
  left: 0px !important;
  border-radius: 0px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>
