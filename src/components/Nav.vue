<template>
  <v-row class="child-flex navbar-row">
    <v-col xl="2" lg="2" md="3" sm="6" cols="12" order-md="1" order="1">
      <v-toolbar dense class="navbar-toolbar-left">
        <v-icon color="#FFFFFF">fa-anchor</v-icon>
        <h2>GameTactic</h2>
        <v-spacer />
      </v-toolbar>
    </v-col>
    <v-col xl="8" lg="7" md="5" sm="12" cols="12" order-md="2" order="3">
      <v-toolbar dense flat class="navbar-toolbar-center justify-center">
        <v-spacer />
        <div>Tactic editing tools</div>
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

@Component
export default class Nav extends Vue {
  @Prop() private id!: string;
}
</script>
<style scoped lang="scss">
.navbar-row {
   div {
    padding: 0px;
  }
}

.navbar-toolbar-left {
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
    content: '';
    position: absolute;
    right: -96px;
    top: 0px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 48px 48px;
    border-color: transparent transparent transparent $room-navbar;
  }
}

.navbar-toolbar-center {
  background-color: $room-background;
  color: $room-navbar-text;
}

.navbar-toolbar-right {
  background-color: $room-navbar;
  color: $room-navbar-text;
  position: relative;
  flex: 0 1 250px;
  z-index: 100;
  &:after {
    content: '';
    position: absolute;
    left: -48px;
    top: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width:  48px 0px 0px 48px;
    border-color: $room-navbar transparent;
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
