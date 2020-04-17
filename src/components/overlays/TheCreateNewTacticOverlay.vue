<template>
    <v-dialog persistent v-model="overlay" width="700" class="custom-overlay">
      <v-card class="pa-12">
        <v-row>
          <v-col>
            <v-card-title>
              Create new tactic
            </v-card-title>
            <v-card-actions>
              <v-text-field
                prepend-icon="fa-file"
                label="Tactic name"
                v-model="tactic.name"
              />
            </v-card-actions>
            <v-card-actions>
              <v-autocomplete
                :items="roomMaps"
                item-text="name"
                :search-input.sync="search"
                v-model="tactic.map"
                color="primary"
                hide-no-data
                hide-selected
                label="Search for maps"
                placeholder="Start typing to Search"
                prepend-icon="fa-search"
                autocomplete="new-password"
                return-object
              >
                <template v-slot:item="data">
                  <v-list-item-avatar size="29" class="custom-list-item-avatar">
                    <img :src="data.item.icon" :alt="data.item.name">
                  </v-list-item-avatar>
                  <v-list-item-content class="custom-list-item-content">
                    <v-list-item-title v-text="data.item.name"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-card-actions>
            <v-spacer></v-spacer>
            <v-card-subtitle>
              <v-btn
                color="primary"
                :disabled="isDisabled()"
                @click="createTactic()"
              >
                Create tactic
              </v-btn>
            </v-card-subtitle>
          </v-col>
          <v-divider vertical />
          <v-col>
            <v-card-subtitle>
              <v-img v-if="tactic.map.icon" :src="tactic.map.icon" max-width="200px"/>
            </v-card-subtitle>
            <v-card-subtitle>{{ tactic.map.name }}</v-card-subtitle>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { EventBus } from '@/event-bus'
import { Map, RoomGetters } from '@/store/modules/room'
import { Getter } from 'vuex-class'

@Component({
  name: 'TheCreateNewTacticOverlay',
  data: () => ({
    tactic: {
      map: {
        name: '',
        icon: '',
        desc: '',
        id: 0
      },
      name: ''
    },
    search: ''
  })
})
export default class CreateNewTacticOverlay extends Vue {
  @Getter(`room/${RoomGetters.ROOM_MAPS}`) roomMaps!: Map[]
  overlay = false
  created () {
    EventBus.$on('openCreateNewTacticOverlay', () => {
      this.overlay = !this.overlay
    })
  }

  $refs!: {
    img: HTMLImageElement;
    imgName: HTMLHeadingElement;
  }

  isDisabled (): boolean {
    return !(this.$data.tactic.name && this.$data.tactic.map.icon)
  }

  createTactic (): void {
    if (!this.isDisabled()) {
      EventBus.$emit('createTactic', this.$data.tactic)
      this.overlay = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .custom-overlay {
    width: 700px;
  }
</style>
