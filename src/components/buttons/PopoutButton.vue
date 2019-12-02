<template>
  <v-menu
    v-if="popout"
    transition="slide-x-transition"
    offset-x
    :nudge-width="200"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        elevation="2"
        v-on="on"
      >
        <v-icon dense>{{icon}}</v-icon>
      </v-btn>
    </template>
    <v-sheet>
      <slot>Default Content For Slot</slot>
    </v-sheet>
  </v-menu>
  <v-btn
    v-else
    icon
    elevation="2"
    @click="onButtonClickHandler"
  >
    <v-icon dense>{{icon}}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'PopoutButton'
})
export default class PopoutButton extends Vue {
  @Prop() private id!: string;
  @Prop() private icon!: string;
  @Prop() private popout!: boolean;
  @Prop() private tool!: string;

  onButtonClickHandler () {
    console.log(`${this.$props.tool} has been clicked`)
    this.$store.dispatch('setTools', this.$props.tool)
  }
}

</script>
<style scoped lang="scss">

</style>
