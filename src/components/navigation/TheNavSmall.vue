<template>
  <span>
    <v-row class="navbar-row custom-not-clickable">
      <v-col cols="12" class="custom-clickable">
        <v-toolbar dense flat class="navbar-toolbar-left">
          <v-img class="ml-3 mr-12" max-width="160" max-height="45" :src="require('@/assets/logo.png')"></v-img>
          <v-spacer />
          <div>
            <the-room-save />
            <v-btn
              class="mr-2"
              icon
              @click.stop="drawer = !drawer"
            >
              <v-icon color="white">fa-bars</v-icon>
            </v-btn>
          </div>
        </v-toolbar>
      </v-col>
      <v-col cols="12">
        <v-toolbar dense flat class="navbar-toolbar-center justify-center custom-background-transparent">
          <the-canvas-tools v-if="isCanvasLoaded" class="custom-clickable" :mobile="true"/>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      right
      temporary
      class="custom-mobile-navigation-drawer"
    >
    <v-list>
      <v-list-item class="custom-mobile-navigation-drawer-close">
      <v-btn
        icon
        @click="drawer = false"
      >
        <v-icon color="primary">fa-times</v-icon>
      </v-btn>
      </v-list-item>
      <v-list-item>
        <the-presentation-mode :isMobile="true"/>
      </v-list-item>
      <v-list-item>
        <the-manage-room :isMobile="true"/>
      </v-list-item>
      <v-divider />
      <v-list-item>
        <the-user-menu :isMobile="true" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</span>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TheRoomSave from './buttons/TheRoomSave.vue'
import ThePresentationMode from './buttons/ThePresentationMode.vue'
import TheManageRoom from './buttons/TheManageRoom.vue'
import TheUserMenu from './TheUserMenu.vue'
import TheCanvasTools from './TheCanvasTools.vue'
import { Getter } from 'vuex-class'
import { RoomGetters } from '../../store/modules/room'

@Component({
  name: 'TheNavSmall',
  components: {
    TheRoomSave,
    ThePresentationMode,
    TheManageRoom,
    TheUserMenu,
    TheCanvasTools
  }
})
export default class TheNavSmall extends Vue {
  @Getter(`room/${RoomGetters.IS_CANVAS_LOADED}`) isCanvasLoaded!: boolean
  drawer = false
}
</script>
<style scoped lang="scss">
.navbar-row {
  margin: 0;
  position: fixed;
   div {
    padding: 0;
  }
}
header.navbar-toolbar-left.navbar-toolbar-left.navbar-toolbar-left {
  background-color: $room-primary;
  color: $room-text;
  position: relative;
  flex: 0 1 100px;
  z-index: 100;
  h2 {
    white-space: nowrap;
    margin: 0.25rem;
  }
}
.navbar-toolbar-center {
  color: black;
  >div {
    justify-content: center;
    align-items: start;
  }
}
.navbar-toolbar-right.navbar-toolbar-right.navbar-toolbar-right {
  background-color: $room-primary;
  color: $room-text;
  position: relative;
  flex: 0 1 250px;
  z-index: 100;
  >div {
    justify-content: flex-end;
    margin-right: 10px;
  }
}
@media screen and (max-width: 960px) {
  .navbar-toolbar-left, .navbar-toolbar-right  {
    flex: 1 1 auto;
    &:after {
      display: none;
    }
  }
}
</style>
<style lang=scss>
.custom-clickable {
  pointer-events: auto;
}
.custom-not-clickable {
  pointer-events: none;
}

.custom-mobile-navigation-drawer-close {
  justify-content: flex-end;
}
</style>
