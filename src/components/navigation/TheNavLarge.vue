<template>
  <v-row class="navbar-row custom-not-clickable">
    <v-toolbar dense flat class="navbar-toolbar-left custom-clickable">
      <v-img class="ml-3 mr-12" max-width="160" max-height="45" :src="require('@/assets/logo.png')"></v-img>
      <v-spacer />
    </v-toolbar>
    <v-toolbar dense flat class="navbar-toolbar-center justify-center custom-not-clickable-large custom-background-transparent">
      <the-canvas-tools v-if="isCanvasLoaded" class="custom-clickable"/>
    </v-toolbar>
    <v-toolbar dense flat class="navbar-toolbar-right custom-clickable">
      <v-spacer />
      <the-room-save />
      <the-presentation-mode />
      <the-manage-room />
      <the-user-menu />
    </v-toolbar>
  </v-row>
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
  name: 'TheNavLarge',
  components: {
    TheRoomSave,
    ThePresentationMode,
    TheManageRoom,
    TheUserMenu,
    TheCanvasTools
  }
})
export default class TheNavLarge extends Vue {
  @Getter(`room/${RoomGetters.IS_CANVAS_LOADED}`) isCanvasLoaded!: boolean
}
</script>
<style lang="scss">
.theme--light.v-toolbar.custom-background-transparent {
  background-color:transparent;
}
.navbar-row {
  margin: 0;
  position: fixed;
  width: 100%;
  div {
    padding: 0;
  }
}
header.navbar-toolbar-left.navbar-toolbar-left.navbar-toolbar-left {
  background-color: $room-primary;
  color: $room-text;
  position: relative;
  flex: 0 1 200px;
  z-index: 100;
  h2 {
    white-space: nowrap;
    margin: 0.25rem;
  }
  &:after {
    content: '';
    position: absolute;
    right: -50px;
    top: 0;
    width: 100%;
    height: 100%;
    -webkit-transform-origin: 100% 0;
    -ms-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: skew(-45deg);
    -ms-transform: skew(-45deg);
    transform: skew(-45deg);
    z-index: -1;
    background: $room-primary;
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
  flex: 0 1 200px;
  z-index: 100;
  &:after {
    content: '';
    position: absolute;
    left: -50px;
    top: 0;
    width: 100%;
    height: 100%;
    -webkit-transform-origin: 100% 0;
    -ms-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: skew(45deg);
    -ms-transform: skew(45deg);
    transform: skew(45deg);
    z-index: -1;
    background: $room-primary;
  }
  div {
    justify-content: flex-end;
    margin-right: 10px;
  }
}
@media screen and (max-width: 860px) {
  .navbar-toolbar-left, .navbar-toolbar-right  {
    flex: 1 1 auto;
    &:after {
      display: none;
    }
  }
}
</style>
<style lang="scss">
  .custom-not-clickable-large, .custom-not-clickable-large > div {
  pointer-events: none;
}
</style>
