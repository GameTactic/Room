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
          <wows-panel v-if="gameName === 'wows'" :clickedItemKey="clickedItemKey" :teams="teams" />
          <wot-panel v-if="gameName === 'wot'" :clickedItemKey="clickedItemKey" :teams="teams" />
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
                <v-img :src="images[gameName]"></v-img>
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
                  :open-delay="500"
                  :key="item.key"
                  :title="$t(`entity.panel.${item.title}`)"
                  :color="item.color"
                >
                  <template v-slot:activator="{ on }">
                    <v-list-item
                      v-on="on"
                      dark
                      active-class="test"
                      :input-value="clickedItemKey === item.key"
                      class="custom-list-item-center"
                      @click="onItemClickHandler(item.key)"
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
                        <v-list-item-title>{{ $t(`entity.panel.${item.title}`) }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <span>{{ $t(`entity.panel.${item.title}`) }}</span>
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
import { RoomGetters, GameName } from '@/store/modules/room'
import { Getter } from 'vuex-class'
import { WowsPanel, WotPanel } from './entity-panel'

export interface MenuItem {
  key: number;
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
  @Prop() private isLoadCanvas!: string;
  @Getter(`room/${RoomGetters.GAME_NAME}`) private readonly gameName!: GameName;

  show = false

  teams: MenuItem[] = [
    { key: 1, title: 'team.one', icon: 'fa-users', color: 'green', noOfEntities: 0 },
    { key: 2, title: 'team.two', icon: 'fa-users', color: 'red', noOfEntities: 0 }
  ]

  items: MenuItem[] = [
    { key: 0, title: 'add', icon: 'fa-plus' },
    ...this.teams
  ]

  clickedItemKey = 0

  images = {
    wows: require('@/assets/wows-icon2.png'),
    wot: require('@/assets/wot-icon.png')
  }

  onItemClickHandler (key: number) {
    this.show = key !== this.clickedItemKey ? true : !this.show
    if (!this.show) {
      this.clickedItemKey = -1
    } else {
      this.clickedItemKey = key
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
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  height: 100%;
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
  height: 480px !important;

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
