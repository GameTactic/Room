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
          :key="entity.uuid"
          :active="entity.uuid === selectedEntityUuid"
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
import { Ship } from '@/types/Games/Wows'
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

  selectedEntityUuid = ''

  entityOnClickHandler (entity: Ship) {
    this.selectedEntityUuid = this.selectedEntityUuid === entity.uuid ? '' : entity.uuid
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
