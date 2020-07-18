<template>
  <v-menu
    offset-y
    nudge-left="100"
    nudge-width="80"
    content-class="elevation-2"
  >
    <template v-slot:activator="{ on: menuItem }">
      <v-btn
        elevation="0"
        color="transparent"
        fab
        x-small
        ripple
        v-on="menuItem"
      >
        <v-icon small color="grey darken-1">fa-ellipsis-v</v-icon>
      </v-btn>
    </template>
    <v-card tile>
      <v-list dense>
        <span
          v-for="(cardItem, index) in cardMenuItems"
          :key="index"
        >
          <v-list-item
            v-if="isMenuItemVisible(item, cardItem)"
            @click="menuOnClickHandler(item, cardItem)"
          >
            <v-list-item-icon class="mr-2">
              <v-icon
                :color="getMenuIconColour(item, cardItem)"
                small
                v-text="getMenuIcon(item, cardItem)"
              />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title :title="getMenuText(item, cardItem)" v-text="getMenuText(item, cardItem)" />
            </v-list-item-content>
          </v-list-item>
        </span>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'
import { MenuItem } from '../types'
import { Tactic, User, Entity } from '@/store/types'

@Component({
  name: 'EntityMenu'
})
export default class EntityMenu extends Vue {
  @Prop() private isMenuItemVisible!: (item: Tactic | User | Entity, cardItem: MenuItem) => void
  @Prop() private menuOnClickHandler!: (item: Tactic | User | Entity, cardItem: MenuItem) => void
  @Prop() private getMenuIconColour!: (item: Tactic | User | Entity, cardItem: MenuItem) => void
  @Prop() private getMenuIcon!: (item: Tactic | User | Entity, cardItem: MenuItem) => void
  @Prop() private getMenuText!: (item: Tactic | User | Entity, cardItem: MenuItem) => void
  @Prop() private cardMenuItems!: MenuItem[]
  @Prop() private item!: Tactic | User | Entity
}
</script>
<style scoped lang="scss">

</style>
