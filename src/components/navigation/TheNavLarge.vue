<template>
  <v-row class="navbar-row">
    <v-toolbar dense class="navbar-toolbar-left">
      <v-img class="ml-3 mr-12" max-width="160" max-height="45" :src="require('@/assets/logo.png')"></v-img>
      <v-spacer />
    </v-toolbar>
    <v-toolbar dense flat class="navbar-toolbar-center justify-center">
      <the-canvas-tools />
    </v-toolbar>
    <v-toolbar dense class="navbar-toolbar-right">
      <v-spacer />
      <v-tooltip bottom nudge-bottom="10">
        <template v-slot:activator="{ on }">
          <v-btn
            dark
            icon
            v-on="on"
          >
            <v-icon size="20">fa-save</v-icon>
          </v-btn>
        </template>
        <span>Save room</span>
      </v-tooltip>
      <the-room-menu />
      <the-user-menu />
    </v-toolbar>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TheRoomMenu from './TheRoomMenu.vue'
import TheUserMenu from './TheUserMenu.vue'
import TheCanvasTools from './TheCanvasTools.vue'

@Component({
  name: 'TheNavLarge',
  components: {
    TheRoomMenu,
    TheUserMenu,
    TheCanvasTools
  }
})
export default class TheNavLarge extends Vue {
  @Prop() private id!: string;
}
</script>
<style lang="scss">
.navbar-row {
  margin: 0px;
  position: fixed;
  width: 100%;
  div {
    padding: 0px;
  }
}
header.navbar-toolbar-left.navbar-toolbar-left.navbar-toolbar-left {
  background-color: $room-primary;
  color: $room-text;
  position: relative;
  flex: 0 1;
  z-index: 100;

  h2 {
    white-space: nowrap;
    margin: 0.25rem;
  }
  &:after {
    content: '';
    position: absolute;
    right: -50px;
    top: 0px;
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
    box-shadow: 7px 3px 5px 0px #aaaaaa;
  }
}
.navbar-toolbar-center {
  color: black;
  >div {
    justify-content: center;
  }
}
.navbar-toolbar-right.navbar-toolbar-right.navbar-toolbar-right {
  background-color: $room-primary;
  color: $room-text;
  position: relative;
  flex: 0 1 250px;
  z-index: 100;
  &:after {
    content: '';
    position: absolute;
    left: -48px;
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
    box-shadow: -7px 3px 5px 0px #aaaaaa;
  }
  div {
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
