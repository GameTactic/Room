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
        <div>
          Content
        </div>
      </v-card>
      <v-navigation-drawer
        class="custom-navigation-drawer"
        mini-variant
        mini-variant-width="56"
        permanent
      >
        <div>
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <v-img :src="images[roomState.game]"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-divider></v-divider>
          <div>
            <v-list
              dense
              nav
            >
              <v-list-item
                v-for="item in items"
                class="custom-list-item-center"
                :key="item.title"
                :title="item.title"
                @click="onItemClickHandler"
              >
                <v-list-item-action>
                  <v-icon :color="item.color">{{ item.icon }}</v-icon>
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

@Component({
  name: 'TheEntityPanel'
})
export default class MapButtons extends Vue {
  @Prop() private id!: string;
  @Getter(`room/${RoomGetters.ROOM_STATE}`) roomState!: RoomState

  show = false

  items = [
    { title: 'Add', icon: 'fa-plus' },
    { title: 'Team 1', icon: 'fa-users', color: 'green' },
    { title: 'Team 2', icon: 'fa-users', color: 'red' }
  ]

  images = {
    wows: require('@/assets/wow-icon.png'),
    wot: require('@/assets/wot-icon.png')
  }

  onItemClickHandler () {
    this.show = true
  }
}
</script>
<style scoped lang="scss">
.custom-card-minimised {
  right: 0;
  height: 500px;
  margin-top: 0.25rem;
  position: fixed;
  display: flex;
  flex-direction: column;
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
        margin: 0.5rem;
      }

      >div {
        margin: 0;
      }
    }
  }

  button {
    color: $room-navbar-text !important;
    margin: 0.5rem;
  }
}

.custom-card-expanded > div > div {
  display: flex;
  max-width: 300px;
}

.custom-navigation-drawer {
  background-color: $room-navbar;

  i {
    color: $room-navbar-text;
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
  padding: 0px;
  justify-content: center;

  &:hover::before {
    background-color: white;
  }
}
</style>
