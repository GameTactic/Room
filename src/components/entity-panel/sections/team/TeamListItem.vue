<template>
  <v-list-item
    :class="[' ml-2 px-0', active ? 'custom-team-item-active' : '']"
    @click="$emit('click', entity)"
  >
    <v-list-item-avatar class="mx-2 my-0" size="30">
      <img :style="{ backgroundColor: entity.color }" :src="entity.image" class="custom-team-image" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="custom-team-title">
        <span v-if="entity.alias" v-text="entity.alias" />
        <span>
          <span v-text="entity.name" />
          <v-chip v-if="entity.tier" small v-text="convertNumberToRomanNumeral(entity.tier)" />
        </span>
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-action class="pa-0 ma-0" @click.stop="teamListItemActionHandler">
      <v-menu
        offset-y
        nudge-left="100"
        nudge-width="80"
        content-class="elevation-2"
      >
        <template v-slot:activator="{ on: menuItem }">
          <v-btn
            v-on="menuItem"
            small
            icon
            class="mr-1"
          >
            <v-icon small color="grey">fa-ellipsis-v</v-icon>
          </v-btn>
        </template>
        <v-card tile>
          <v-list dense>
            <v-list-item
              v-for="(cardItem, index) in menuItems"
              :key="index"
              @click="teamMenuOnClickHandler(cardItem)"
            >
              <v-list-item-icon class="custom-entity-menu-icon">
                <v-icon
                  :color="getTeamMenuColour(entity, cardItem)"
                  small
                  v-text="getTeamMenuIcon(entity, cardItem)" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="getTeamMenuText(entity, cardItem)" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'
import { Ship } from '@/types/games/wows'
import { TeamMenuOptions, MenuItem } from '../../types'
import { Game } from '@/store/types'
import { getEntityName, convertNumberToRomanNumeral } from '@/games/utils'
import { EventBus } from '@/event-bus'

@Component({
  name: 'TeamListItem'
})
export default class TeamListItem extends Vue {
  @Prop() private readonly entity!: Ship
  @Prop() private readonly active!: boolean
  @Prop() private readonly game!: Game

  getEntityName = getEntityName
  entityName: string = this.getEntityName(this.game)

  // util function
  convertNumberToRomanNumeral = convertNumberToRomanNumeral

  teamMenuOnClickHandler (menuItem: MenuItem) {
    switch (menuItem.action) {
      case TeamMenuOptions.STATS:
        EventBus.$emit('openTheEntityPropertiesModal', this.entity)
        break
      case TeamMenuOptions.CLONE_ENTITY_TEAM: break
      case TeamMenuOptions.CLONE_ENTITY_DIFFERENT_TEAM: break
      case TeamMenuOptions.DELETE: break
      default: break
    }
  }

  getTeamMenuColour (entity: Ship, item: MenuItem) {
    if (item.action === TeamMenuOptions.DELETE) {
      return 'error'
    }
    return ''
  }

  getTeamMenuIcon (entity: Ship, item: MenuItem) {
    return item.icon
  }

  getTeamMenuText (entity: Ship, item: MenuItem) {
    return this.$t(item.title)
  }

  menuItems: MenuItem[] = [{
    action: TeamMenuOptions.STATS,
    title: 'teams.menu.stats',
    icon: 'fa-edit'
  }, {
    action: TeamMenuOptions.CLONE_ENTITY_TEAM,
    title: 'teams.menu.cloneEntityTeam',
    icon: 'fa-clone'
  }, {
    action: TeamMenuOptions.CLONE_ENTITY_DIFFERENT_TEAM,
    title: 'teams.menu.cloneEntityDifferentTeam',
    icon: 'fa-clone'
  }, {
    action: TeamMenuOptions.DELETE,
    title: 'teams.menu.delete',
    icon: 'fa-times'
  }]

  teamListItemActionHandler () {
    // console.log('fired')
  }
}
</script>

<style lang="scss" scoped>
  .custom-team-image {
    filter: opacity(0.75);
  }

  .custom-team-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    >span {
      display: flex;
      align-items: center;
    }

    .v-chip {
      cursor: pointer;
      margin-left: 0.5rem;
    }
  }

  .custom-team-item-active {
    border: 1px solid #004e8c;
    border-radius: 4px;
  }
</style>
<style lang="scss">
.custom-entity-menu-icon {
  margin-right: 6px !important;
}
</style>
