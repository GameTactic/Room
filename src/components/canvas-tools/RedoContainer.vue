<template>
  <v-tooltip right nudge-right="10">
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="isDisabled"
        class="redoBtn"
        icon
        v-on="on"
        elevation="0"
        @click="onButtonClickHandler"
      >
        <v-icon dense color="primary">{{icon}}</v-icon>
      </v-btn>
    </template>
    <span>Redo</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { CanvasGetters } from '@/store/modules/canvas'
import { CanvasElement } from '@/types/Canvas'
import { EventBus } from '@/event-bus'
import HandleUndoRedo from '@/util/HandleUndoRedo'

@Component({
  name: 'RedoContainer.vue'
})
export default class RedoContainer extends Vue {
  @Prop() private id!: string
  @Prop() private icon!: string
  @Prop() private toolname!: string
  @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`) canvasElementsHistory!: CanvasElement[]
  @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS}`) canvasElements!: CanvasElement[]

  onButtonClickHandler () {
    EventBus.$emit('undoRedo', (this.toolname.charAt(0).toUpperCase() + this.toolname.slice(1)))
  }

  get isDisabled (): boolean {
    const undoRedo = new HandleUndoRedo(this.canvasElementsHistory, this.canvasElements)
    return (undoRedo.findRedo([...this.canvasElementsHistory]) === undefined)
  }
}

</script>
<style scoped lang="scss">
.v-menu-content-class {
  margin-left: 5px;
  box-shadow: 0 4px 4px -3px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}
.tools-caret-down {
  right:2px;
  transition:0.2s ease-in-out;
  margin-top:28px;
}
.rotate90 {
  transform: rotate(-90deg);
}
.redoBtn {
  background-color: white;
  padding: 0 12px;
  height: 48px;
  min-height: 0;
  min-width: 48px;
  color: $room-primary;
  border-radius: 0;
  border-color: rgba(0, 0, 0, 0.12);
  border-style:solid;
  border-width:0.4px 1.5px 1.5px 1.5px !important; // override
}
</style>
