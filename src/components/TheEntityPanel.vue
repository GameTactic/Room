<template>
  <v-card
    :class="`custom-card-minimised ${show ? 'custom-card-expanded' : ''}`"
    :elevation="5"
  >
    <v-row>
      <v-col class="pt-1" id="entity-panel">
        <v-card
          tile
          class="custom-entity-panel"
        >
          <wows-panel v-if="roomState.game.name === 'wows'" :clickedItem="clickedItem" :teams="teams" />
          <wot-panel v-if="roomState.game.name === 'wot'" :clickedItem="clickedItem" :teams="teams" />
        </v-card>
      </v-col>
      <v-col class="pt-1">
        <v-navigation-drawer
          class="custom-navigation-drawer"
          mini-variant
          mini-variant-width="50"
          permanent
        >
          <div>
            <v-list-item class="px-2">
              <v-list-item-avatar>
                <v-img :src="images[roomState.game.name]"></v-img>
              </v-list-item-avatar>
            </v-list-item>
            <v-divider></v-divider>
            <div>
              <v-list
                dense
                nav
              >
                <v-tooltip
                  left
                  v-for="(item, index) in items"
                  :key="item.title"
                  :title="item.title"
                  :color="item.color"
                >
                  <template v-slot:activator="{ on }">
                    <v-list-item
                      v-on="on"
                      dark
                      active-class="test"
                      :input-value="clickedItem === item.title"
                      class="custom-list-item-center"
                      @click="onItemClickHandler(item.title)"
                    >
                      <v-list-item-action>
                        <v-badge
                          v-if="index"
                          :content="item.noOfEntities"
                        >
                          <v-icon :color="item.color">{{ item.icon }}</v-icon>
                        </v-badge>
                        <v-icon
                          v-else
                          :color="item.color"
                        >
                          {{ item.icon }}
                        </v-icon>
                      </v-list-item-action>

                      <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <span>{{ item.title }}</span>
                </v-tooltip>
              </v-list>
            </div>
          </div>
        </v-navigation-drawer>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RoomGetters, RoomState } from '@/store/modules/room'
import { Getter } from 'vuex-class'
import { WowsPanel, WotPanel } from './entity-panel'

export interface MenuItem {
  id: number;
  title: string;
  icon: string;
  color?: string;
  noOfEntities?: number;
}

@Component({
  name: 'TheEntityPanel',
  components: {
    WowsPanel,
    WotPanel
  }
})
export default class MapButtons extends Vue {
  @Prop() private id!: string;
  @Getter(`room/${RoomGetters.ROOM_STATE}`) private readonly roomState!: RoomState;

  show = false

  teams: MenuItem[] = [
    { id: 1, title: 'Team 1', icon: 'fa-users', color: 'green', noOfEntities: 0 },
    { id: 2, title: 'Team 2', icon: 'fa-users', color: 'red', noOfEntities: 0 }
  ]

  items: MenuItem[] = [
    { id: 0, title: 'Add', icon: 'fa-plus' },
    ...this.teams
  ]

  clickedItem = 'Add'

  images = {
    wows: require('@/assets/wows-icon2.png'),
    wot: require('@/assets/wot-icon.png')
  }

  onItemClickHandler (title: string) {
    this.show = title !== this.clickedItem ? true : !this.show
    if (!this.show) {
      this.clickedItem = ''
    } else {
      this.clickedItem = title
    }
  }
}
</script>
<style scoped lang="scss">
.custom-card-minimised>div {
  top: 48px;
  right: 0;
  position: fixed;
  display: flex;
  justify-content: space-between;
  transition: width 1s;

  >div {
    margin: 0;

    >div {
      display: none;
      margin: 0;
      flex-grow: 1;
      flex-direction: column;

      >div:first-child {
        flex-grow: 1;
      }

      >div {
        margin: 0;
      }
    }
  }

  button {
    color: $room-text !important;
    margin: 0.5rem;
  }
}

.custom-entity-panel {
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 300px;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}

.custom-card-expanded >div >div {
  >div {
    display: flex;
  }
  &:first-child {
    padding: 0px;
    width: 350px;
  }

  &:last-child {
    padding: 0px;
    flex: 0 0 62px;
    max-width: 62px;
  }
}

.custom-navigation-drawer {
  background-color: $room-primary;

  i {
    color: $room-text;
  }

  >div >div {
    display: flex;
    height: 100%;
    flex-direction: column;

    >div:first-child {
      flex: 1 1 30px;
    }

    >div:last-child {
      display: flex;
      flex-direction: column;
      flex: 1 1 100%;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.custom-list-item-center {
  padding-top: 0px;
  padding-bottom: 0px;
  justify-content: center;

  &:hover::before {
    background-color: white;
  }
}
.test {
  background-color: rgba(white, 0.001);
  color: white;
}
</style>
