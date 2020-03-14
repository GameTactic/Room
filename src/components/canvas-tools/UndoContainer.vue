<template>
  <v-btn
    :disabled="isDisabled"
    class="undoBtn"
    icon
    elevation="2"
    text
    @click="onButtonClickHandler"
  >
    <v-icon dense color="black">{{icon}}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { CanvasGetters } from '@/store/modules/canvas'
import { CanvasElement } from '@/types/Canvas'
import { EventBus } from '@/event-bus'
import UndoRedo from '@/tools/UndoRedo'

@Component({
  name: 'UndoContainer.vue'
})
export default class UndoContainer extends Vue {
    @Prop() private id!: string
    @Prop() private icon!: string
    @Prop() private toolname!: string
    @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`) canvasElementsHistory!: CanvasElement[]

    onButtonClickHandler () {
      EventBus.$emit('undoRedo', this.toolname)
    }

    get isDisabled (): boolean {
      const undoRedo = new UndoRedo()
      return (undoRedo.findUndo([...this.canvasElementsHistory]) === undefined)
    }
}

</script>
<style scoped lang="scss">
.v-menu-content-class {
  margin-left: 5px;
  box-shadow: 0px 4px 4px -3px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}
.tools-caret-down {
  right:2px;
  transition:0.2s ease-in-out;
  margin-top:28px;
}
.rotate90 {
  transform: rotate(-90deg);
}
.undoBtn {
  background-color: white;
  padding: 0 12px;
  height: 48px;
  min-height: 0;
  min-width: 48px;
  color: rgba(0, 0, 0, 0.54);
  border-radius: 4px;
  border-style: solid;
  border-width: thin;
}
</style>
