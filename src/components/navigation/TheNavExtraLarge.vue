<template>
  <v-row class="navbar-row">
    <v-col xl="2" lg="2" md="3" sm="6" cols="12" order-md="1" order="1">
      <v-toolbar dense class="navbar-toolbar-left">
        <v-img max-width="240" max-height="45" src="https://i.imgur.com/8U02bLM.png"></v-img>
        <v-spacer />
      </v-toolbar>
    </v-col>
    <v-col xl="8" lg="7" md="5" sm="12" cols="12" order-md="2" order="3">
      <v-toolbar dense flat class="navbar-toolbar-center justify-center">
        <v-spacer />
        <div><strong><i class="fas fa-plus"></i></strong></div>
        <div><strong><i class="fas fa-minus"></i></strong></div>
        <v-spacer />
      </v-toolbar>
     </v-col>
     <v-col xl="2" lg="3" md="4" sm="6" cols="12" order-md="3" order="2">
      <v-toolbar dense class="navbar-toolbar-right">
        <v-btn dark icon title="Save your room">
          <v-icon>fa-save</v-icon>
        </v-btn>
        More buttons inc Sign In / Out
        <v-spacer />
      </v-toolbar>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'TheNavExtraLarge'
})
export default class TheNavExtraLarge extends Vue {
  @Prop() private id!: string;
}

</script>
<style scoped lang="scss">
.navbar-row {
  margin: 0px;
   div {
    padding: 0px;
  }
}

header.navbar-toolbar-left.navbar-toolbar-left.navbar-toolbar-left {
  background-color: $room-navbar;
  color: $room-navbar-text;
  position: relative;
  flex: 0 1 100px;
  z-index: 100;
  h2 {
    white-space: nowrap;
    margin: 0.25rem;
  }
  &:after {
content: "";
    position: absolute;
    right: -96px;
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
    background: #00154f;
    box-shadow: 7px 3px 5px 0px #aaaaaa;
  }
}

.navbar-toolbar-center {
  color: black;
}

.navbar-toolbar-right.navbar-toolbar-right.navbar-toolbar-right {
  background-color: $room-navbar;
  color: $room-navbar-text;
  position: relative;
  flex: 0 1 250px;
  z-index: 100;
  &:after {
content: "";
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
    background: #00154f;
    box-shadow: -7px 3px 5px 0px #aaaaaa;
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
