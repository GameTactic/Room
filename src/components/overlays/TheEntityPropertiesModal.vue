<template>
  <v-dialog v-model="overlay" width="350">
    <v-card class="pa-12 custom-entity-properties-card">
      <v-btn
        icon
        small
        :title="$t('button.cancel')"
        @click="overlay = false"
      >
        <v-icon color="secondary">fa-times</v-icon>
      </v-btn>
      <v-text-field
        id="selectedEntity-alias"
        :value="selectedEntity ? selectedEntity.alias : ''"
        :label="$t('entity.alias.textField')"
        :placeholder="$t('entity.alias.placeholder', { entity: getEntityName(this.game) })"
        outlined
        dense
        @change="aliasOnChangeHandler"
      />
      <the-entity-properties-content v-if="game === Game.WOWS" :fields="fields" :selectedEntity="selectedEntity" />
      <div class="d-flex justify-end">
        <v-btn
          color="primary"
          :title="$t('button.save')"
          @click="saveEntityOnClickHandler"
        >
        <v-icon>fa-save</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { EventBus } from '@/event-bus'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { OpenOverlayList } from './types'
import { GameEntity } from '@/types/games'
import { SocketRoomGetters } from '@/store/modules/socket/room'
import { Game } from '@/store/types'
import { fields as wowsFields } from '@/games/wows/fields'
import TheEntityPropertiesContent from './wows/TheEntityPropertiesContent.vue'
import { getEntityName } from '@/games/utils'
import { SocketTeamAction } from '@/store/modules/socket/team'

const SocketRoom = namespace(Namespaces.SOCKET_ROOM)
const SocketTeam = namespace(Namespaces.SOCKET_TEAM)

@Component({
  name: 'TheEntityPropertiesModal',
  components: { TheEntityPropertiesContent }
})
export default class TheEntityPropertiesModal extends Vue {
  @SocketRoom.Getter(SocketRoomGetters.GAME) game!: Game
  @SocketTeam.Action(SocketTeamAction.UPDATE_ENTITY_IN_TEAM) updateEntityInTeam!: (payload: GameEntity) => void

  overlay = false
  selectedEntity: GameEntity | null = null
  fields = wowsFields
  // enum
  Game = Game
  getEntityName = getEntityName

  created () {
    EventBus.$on(OpenOverlayList.OPEN_THE_ENTITY_PROPERTIES_MODAL, (entity: GameEntity) => {
      this.overlay = true
      this.selectedEntity = { ...entity, data: { ...entity.data } }
    })
  }

  aliasOnChangeHandler (value: string) {
    if (this.selectedEntity) {
      this.selectedEntity = { ...this.selectedEntity, alias: value }
    }
  }

  saveEntityOnClickHandler () {
    if (this.selectedEntity) {
      this.updateEntityInTeam(this.selectedEntity)
      this.overlay = false
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-entity-properties-card {
  display: flex;
  flex-direction: column;
  >button {
    align-self: flex-end;
    margin-bottom: 0.5rem;
  }
}
</style>
