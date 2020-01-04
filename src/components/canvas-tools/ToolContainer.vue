<template>
  <v-menu
    v-if="popout"
    transition="scale-transition"
    content-class="v-menu-content-class"
    :close-on-content-click="false"
    offset-x
  >
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        elevation="2"
        v-on="on"
        @click="onButtonClickHandler"
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
import { ITool } from '../../types/canvas'

@Component({
  name: 'ToolContainer'
})
export default class ToolContainer extends Vue {
  @Prop() private id!: string;
  @Prop() private icon!: string;
  @Prop() private popout!: boolean;
  @Prop() private toolname!: string;

  onButtonClickHandler () {
    if (this.$store.getters.enabledTool) {
      this.$store.dispatch('setDisabledTool')
    } else {
      this.$store.dispatch('setEnabledTool', this.toolname)
    }
    this.$store.dispatch('setDisabled')
  }
}

</script>
<style scoped lang="scss">
.v-menu-content-class {
  margin-left: 5px;
  box-shadow: 0px 4px 4px -3px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}
</style>
