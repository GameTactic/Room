<template>
  <v-card
    :class="`custom-card-minimised ${show ? 'custom-card-expanded' : ''}`"
    :elevation="5"
  >
    <v-row>
      <v-card
        tile
        flat
      >
        <wows-panel v-if="roomState.game.name === 'wows'" :clickedItem="clickedItem" :teams="teams" />
        <wot-panel v-if="roomState.game.name === 'wot'" :clickedItem="clickedItem" :teams="teams" />
      </v-card>
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
              <v-list-item
                v-for="(item, index) in items"
                class="custom-list-item-center"
                :key="item.title"
                :title="item.title"
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
            </v-list>
            <v-btn
              small
              icon
              tile
              @click="show = !show"
            >
              <v-icon>{{ show ? 'fa-chevron-right' : 'fa-chevron-left' }}</v-icon>
            </v-btn>
          </div>
        </div>
      </v-navigation-drawer>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RoomGetters, RoomState } from '@/store/modules/room'
import { Getter } from 'vuex-class'
import { WowsPanel, WotPanel } from './entity-panel'

export interface MenuItem {
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
    { title: 'Team 1', icon: 'fa-users', color: 'green', noOfEntities: 0 },
    { title: 'Team 2', icon: 'fa-users', color: 'red', noOfEntities: 0 }
  ]

  items: MenuItem[] = [
    { title: 'Add', icon: 'fa-plus' },
    ...this.teams
  ]

  clickedItem = 'Add'

  images = {
    wows: require('@/assets/wows-icon2.png'),
    wot: require('@/assets/wot-icon.png')
  }

  onItemClickHandler (title: string) {
    this.show = true
    this.clickedItem = title
  }
}
</script>
<style scoped lang="scss">
.custom-card-minimised {
  top: 50px;
  right: 0;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: width 1s;
  height: 650px;

  >div {
    margin: 0;

    >div {
      display: none;
      margin: 0;
      flex-grow: 1;
      flex-direction: column;

      >div:first-child {
        flex-grow: 1;
        margin: 0.5rem;
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

.custom-card-expanded > div > div {
  display: flex;
  max-width: 250px;
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
      flex: 1 1 80%;
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

@media screen and (max-width: 1199px) {
  .custom-card-minimised {
    top: 100px;
  }
}
</style>
