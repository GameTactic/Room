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
      <entity-menu
        :item="entity"
        :cardMenuItems="cardMenuItems"
        :isMenuItemVisible="() => true"
        :menuOnClickHandler="teamMenuOnClickHandler"
        :getMenuIconColour="getTeamMenuColour"
        :getMenuIcon="getTeamMenuIcon"
        :getMenuText="getTeamMenuText"
      />
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'
import { TeamMenuOptions, MenuItem } from '../../types'
import { Game, AddTeamToEntity } from '@/store/types'
import { getEntityName, convertNumberToRomanNumeral } from '@/games/utils'
import { EventBus } from '@/event-bus'
import { OpenOverlayList } from '@/components/overlays/types'
import { GameEntity } from '@/types/games'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { SocketTeamAction } from '@/store/modules/socket/team'
import EntityMenu from '../EntityMenu.vue'

const SocketTeam = namespace(Namespaces.SOCKET_TEAM)

@Component({
  name: 'TeamListItem',
  components: { EntityMenu }
})
export default class TeamListItem extends Vue {
  @Prop() private readonly entity!: GameEntity
  @Prop() private readonly active!: boolean
  @Prop() private readonly game!: Game
  @SocketTeam.Action(SocketTeamAction.ADD_ENTITY_TO_TEAM) addEntityToTeam!: (payload: AddTeamToEntity) => void

  getEntityName = getEntityName
  entityName: string = this.getEntityName(this.game)
  cardMenuItems: MenuItem[] = [{
    action: TeamMenuOptions.STATS,
    title: 'teams.menu.stats',
    icon: 'fa-edit'
  }, {
    action: TeamMenuOptions.DUPLICATE_ENTITY_TEAM,
    title: 'teams.menu.duplicateEntityTeam',
    icon: 'far fa-clone'
  }, {
    action: TeamMenuOptions.DUPLICATE_ENTITY_DIFFERENT_TEAM,
    title: 'teams.menu.duplicateEntityDifferentTeam',
    icon: 'far fa-clone'
  }, {
    action: TeamMenuOptions.DELETE,
    title: 'teams.menu.delete',
    icon: 'fa-times'
  }]

  // util function
  convertNumberToRomanNumeral = convertNumberToRomanNumeral

  teamMenuOnClickHandler (_entity: GameEntity, menuItem: MenuItem) {
    switch (menuItem.action) {
      case TeamMenuOptions.STATS:
        EventBus.$emit(OpenOverlayList.OPEN_THE_ENTITY_PROPERTIES_OVERLAY, this.entity)
        break
      case TeamMenuOptions.DUPLICATE_ENTITY_TEAM: break
      case TeamMenuOptions.DUPLICATE_ENTITY_DIFFERENT_TEAM: break
      case TeamMenuOptions.DELETE: break
      default: break
    }
  }

  getTeamMenuColour (_entity: GameEntity, menuItem: MenuItem) {
    if (menuItem.action === TeamMenuOptions.DELETE) {
      return 'error'
    }
    return 'primary'
  }

  getTeamMenuIcon (_entity: GameEntity, menuItem: MenuItem) {
    return menuItem.icon
  }

  getTeamMenuText (_entity: GameEntity, menuItem: MenuItem) {
    return this.$t(menuItem.title)
  }

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
