<template>
  <v-tooltip
    right
    nudge-right="10"
    :open-delay="500"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="isDisabled || !isCanvasLoaded"
        class="undoBtn"
        icon
        elevation=""
        v-on="on"
        text
        @click="onButtonClickHandler"
      >
        <v-icon dense color="primary">{{icon}}</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('undo.container.undo') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CanvasAction, CanvasGetters } from '@/store/modules/canvas'
import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'
import HandleUndoRedo from '@/util/HandleUndoRedo'
import HandleRenderShapes from '@/util/HandleRenderShapes'
import { RoomGetters } from '../../store/modules/room'

@Component({
  name: 'UndoContainer.vue'
})
export default class UndoContainer extends Vue {
    @Prop() private icon!: string
    @Prop() private toolname!: string
    @Getter(`room/${RoomGetters.IS_CANVAS_LOADED}`) isCanvasLoaded!: boolean
    @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`) canvasElementsHistory!: CanvasElementHistory[]
    @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS}`) canvasElements!: CanvasElement[]
    @Action(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`) addCanvasElementHistory!: (canvasElement: CanvasElement) => void
    @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENT_HISTORY_BY_ID}`) canvasElementHistoryById!: (id: string) => CanvasElementHistory | void
    @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENT_BY_ID}`) canvasElementById!: (id: string) => CanvasElement | void

    onButtonClickHandler () {
      const handleUndoRedo = new HandleUndoRedo()
      handleUndoRedo.handleUndoRedo('Undo')
      new HandleRenderShapes(this.$store).handle()
    }

    get isDisabled (): boolean {
      return new HandleUndoRedo().findUndo([...this.canvasElementsHistory]) === undefined
    }

    created () {
      window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'z') {
          this.onButtonClickHandler()
        }
      })
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
.undoBtn {
  background-color: white;
  padding: 0 12px;
  height: 48px;
  min-height: 0;
  min-width: 48px;
  border-radius: 0;
  border-color: rgba(0, 0, 0, 0.12);
  border-style:solid;
  border-width:0.4px 1.5px 0.5px 1.5px !important; // override
}
</style>
