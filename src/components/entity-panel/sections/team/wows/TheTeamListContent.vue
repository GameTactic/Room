<template>
  <span>
    <span class="custom-team-title-container">
      <span class="ml-2 caption" v-text="$t(selectedTeam.name)" />
      <v-icon small>far fa-eye</v-icon>
    </span>
    <v-divider class="mx-2" />
    <v-list dense>
      <v-list-item-group>
        <team-list-item
          v-for="entity in selectedTeam.entities"
          :key="entity.id"
          :active="entity.id === selectedEntityId"
          :entity="entity"
          :game="game"
          @click="entityOnClickHandler"
        />
      </v-list-item-group>
    </v-list>
  </span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Ship } from '@/types/games/wows'
import { Team, Game } from '@/store/types'
import TeamListItem from '../TeamListItem.vue'
import { Prop } from 'vue-property-decorator'

@Component({
  name: 'TheTeamListContent',
  components: {
    TeamListItem
  }
})
export default class TheTeamListContent extends Vue {
  @Prop() selectedTeam!: Team | undefined
  @Prop() game!: Game

  selectedEntityId = ''

  entityOnClickHandler (entity: Ship) {
    this.selectedEntityId = this.selectedEntityId === entity.id ? '' : entity.id
  }
}
</script>
<style lang="scss" scoped>
.custom-team-title-container {
  display: flex;
  justify-content: space-between;
}
</style>
<style lang="scss">
.custom-text-field-wows .v-text-field__details {
  display: none;
}
</style>
