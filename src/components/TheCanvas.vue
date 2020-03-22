<template>
  <v-stage
    ref="stage"
    class="konva-stage"
    :class="[enabledTool ? enabledTool.name : '']"
    :config="stageSize"
    @mousedown="onMouseDownHandler"
    @mouseup="onMouseUpHandler"
    @mousemove="onMouseMoveHandler"
  >
    <v-layer ref="layer" :config="{ id: canvasElement.layerId }" />
  </v-stage>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator'
import Component from 'vue-class-component'
import { Tool, Tracker } from '@/tools/Tool'
import { CanvasElement, VueKonvaLayer, VueKonvaStage } from '@/types/Canvas'
import Vue from 'vue'
import { Namespaces } from '@/store'
import { Action, Getter, namespace } from 'vuex-class'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'
import { CanvasAction, CanvasGetters, HideCanvasElementInterface } from '@/store/modules/canvas'
import Konva from 'konva'
import { SocketActions, SocketGetters } from '@/store/modules/socket'
import { EventBus } from '@/event-bus'
import UndoRedo from '@/tools/UndoRedo'

const Tools = namespace(Namespaces.TOOLS)
const Sockets = namespace(Namespaces.SOCKET)

@Component({
  name: 'TheCanvas'
})

export default class TheCanvas extends Vue {
  @Prop() private id!: string
  @Tools.Action(ToolsAction.DISABLE) disable!: () => void
  @Action(`tools/${ToolsAction.ENABLE}`) enable!: () => void
  @Action(`tools/${ToolsAction.ENABLE_TOOL}`) enableTool!: (name: string) => void
  @Getter(`tools/${ToolGetters.ENABLED_TOOL}`) enabledTool!: Tool
  @Getter(`tools/${ToolGetters.ENABLED}`) enabled!: boolean
  @Getter(`tools/${ToolGetters.TOOLS}`) tools!: Tool[]
  @Sockets.Getter(SocketGetters.SOCKET) socket!: WebSocket
  @Sockets.Action(SocketActions.SEND_IF_OPEN) send!: (message: string) => void
  @Action(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT}`) addCanvasElement!: (canvasElement: CanvasElement) => void
  @Action(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`) addCanvasElementHistory!: (canvasElement: CanvasElement) => void
  @Action(`canvas/${CanvasAction.HIDE_CANVAS_ELEMENT}`) hideCanvasElement!: (payload: HideCanvasElementInterface) => void
  @Action(`canvas/${CanvasAction.DELETE_CANVAS_ELEMENT}`) deleteCanvasElement!: (canvasElement: CanvasElement) => void
  @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS}`) canvasElements!: CanvasElement[]
  @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`) canvasElementsHistory!: CanvasElement[]

  stageSize = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  canvasElement: CanvasElement = {
    jti: 'SAM',
    id: '',
    data: [],
    tool: {
      name: '',
      colour: '',
      size: 0,
      temporary: false
    },
    layerId: Math.random().toString(36),
    tracker: Tracker.ADDITION,
    change: false,
    hasMoved: false
  }

  $refs!: {
    layer: VueKonvaLayer;
    stage: VueKonvaStage;
  }

  created () {
    window.addEventListener('resize', (e) => {
      const currentTarget = e.currentTarget as Window
      if (currentTarget) {
        this.$data.stageSize = {
          width: currentTarget.innerWidth,
          height: currentTarget.innerHeight
        }
      }
    }, true)

    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'z') {
        EventBus.$emit('undoRedo', 'undo')
      } else if (e.ctrlKey && e.key === 'y') {
        EventBus.$emit('undoRedo', 'redo')
      }
    })

    EventBus.$on('undoRedo', (undoRedo: string) => {
      const data: CanvasElement | void = this[undoRedo]()
      if (data) {
        this.socket.send(JSON.stringify(data))
        this.renderShapes()
      }
    })

    EventBus.$on('addText', (canvasElement: CanvasElement) => {
      if (canvasElement.tool.textString && canvasElement.tool.textString?.length > 0) {
        const foundNode: Konva.Collection<Konva.Group> = this.layerNode.getChildren().find((group: Konva.Group) => group.attrs.id === canvasElement.id)
        const foundElement = this.canvasElements.find((element: CanvasElement) => element.id === canvasElement.id)
        if (foundElement && foundNode) {
          const group: Konva.Group | undefined = foundNode.toArray().find((group: Konva.Group) => group.attrs.id === canvasElement.id)
          const textElement: Konva.Text | undefined = group?.findOne<Konva.Text>((node: Konva.Text) => node)
          if (textElement) {
            textElement.text(canvasElement.tool.textString)
            if (textElement.getTextWidth() > (this.layerNode.getWidth() - textElement.getAbsolutePosition().x)) {
              textElement.width(this.layerNode.getWidth() - textElement.getAbsolutePosition().x)
            }
            foundElement.tool.textString = canvasElement.tool.textString
            this.layerNode.batchDraw()
            this.socket.send(JSON.stringify(canvasElement))
          }
        }
      } else {
        this.deleteCanvasElement(canvasElement)
      }
    })

    EventBus.$on('focusOut', (canvasElement: CanvasElement) => {
      this.deleteCanvasElement(canvasElement)
    })

    this.socket.onmessage = (data: MessageEvent) => {
      try {
        const canvasElement: CanvasElement = JSON.parse(data.data).payload
        if (canvasElement.layerId !== this.$data.canvasElement.layerId) {
          if (canvasElement.tool.temporary) {
            const foundTool = this.tools.find((tool: Tool) => tool.name === canvasElement.tool.name)
            if (foundTool && foundTool.renderCanvas) {
              foundTool.renderCanvas(canvasElement, this.layerNode)
            }
          } else {
            if (canvasElement.change) {
              const foundElement = this.canvasElements.find((element: CanvasElement) => element.id === canvasElement.id)
              if (foundElement) {
                foundElement.tracker = (foundElement.tracker === Tracker.ADDITION ? Tracker.REMOVAL : Tracker.ADDITION)
              }
            } else if (canvasElement.tool.name === 'erase' && canvasElement.tool.erase) {
              canvasElement.tool.erase.forEach((groupId: string) => {
                this.hideCanvasElement({ fromSocket: true, id: groupId })
              })
            } else {
              this.addCanvasElement(canvasElement)
            }
          }
        }
        this.renderShapes()
      } catch (err) { }
    }
  }

  beforeDestroy () {
    window.removeEventListener('resize', () => null)
  }

  renderShapes (): void {
    this.canvasElements.forEach((canvasElement: CanvasElement) => {
      if (canvasElement.tool.renderCanvas) {
        if (canvasElement.tracker === Tracker.ADDITION) {
          if (!this.layerNode.find((shape: Konva.Shape) => shape.attrs.id === canvasElement.id).length) {
            canvasElement.tool.renderCanvas(canvasElement, this.layerNode)
          }
        } else if (canvasElement.tracker === Tracker.REMOVAL) {
          if (this.layerNode.find((shape: Konva.Shape) => shape.attrs.id === canvasElement.id).length) {
            const group = this.layerNode.find((shape: Konva.Shape) => shape.attrs.id === canvasElement.id)[0]
            const eraser = this.tools.find((tool: Tool) => tool.name === 'erase')
            if (eraser && eraser.eraseGroup) {
              eraser.eraseGroup(this.layerNode, [group.attrs.id])
            }
          }
        }
      }
    })
    this.layerNode.getChildren().forEach((group: Konva.Group) => {
      if (!this.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === group.attrs.id) && !group.attrs.temporary) {
        const eraser = this.tools.find((tool: Tool) => tool.name === 'erase')
        if (eraser && eraser.eraseGroup) {
          eraser.eraseGroup(this.layerNode, [group.attrs.id])
        }
      }
    })
  }

  onMouseDownHandler (e: Konva.KonvaPointerEvent): void {
    if (this.enabledTool?.mouseDownAction) {
      this.enable()
      this.enabledTool.mouseDownAction(e, this.$data.canvasElement, this.layerNode, this.socket)
    }
  }

  onMouseMoveHandler (e: Konva.KonvaPointerEvent): void {
    if (this.enabledTool?.mouseMoveAction && this.enabled) {
      this.enabledTool.mouseMoveAction(e, this.$data.canvasElement, this.layerNode, this.socket)
    }
  }

  onMouseUpHandler (e: Konva.KonvaPointerEvent): void {
    if (this.enabledTool?.mouseUpAction && this.enabled) {
      this.disable()
      if (this.enabledTool.name !== 'erase') {
        this.enabledTool.mouseUpAction(e, this.$data.canvasElement, this.layerNode, this.socket)
      }
      if (!this.enabledTool.temporary) {
        if (this.enabledTool.name === 'erase' && this.$data.canvasElement.tool.erase) {
          this.$data.canvasElement.tool.erase.forEach((groupId: string) => {
            this.hideCanvasElement({ fromSocket: false, id: groupId })
          })
          this.enabledTool.mouseUpAction(e, this.$data.canvasElement, this.layerNode, this.socket)
        } else {
          if (this.$data.canvasElement.hasMoved) {
            this.addCanvasElement({
              ...this.$data.canvasElement,
              tool: { ...this.enabledTool },
              temporary: false
            })
            this.addCanvasElementHistory({ ...this.$data.canvasElement })
          }
        }
      }
      this.renderShapes()
    }
  }

  redo (): CanvasElement | void {
    const undoRedo = new UndoRedo()
    const foundElement = undoRedo.findRedo([...this.canvasElementsHistory])
    if (foundElement) {
      const canvasElement = this.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === foundElement.id)
      if (canvasElement) {
        canvasElement.tracker = (canvasElement.tracker === Tracker.ADDITION ? Tracker.REMOVAL : Tracker.ADDITION)
        const newElement: CanvasElement = {
          id: canvasElement.id,
          tool: canvasElement.tool,
          data: canvasElement.data,
          layerId: canvasElement.layerId,
          jti: canvasElement.jti,
          tracker: Tracker.REDO,
          change: true,
          hasMoved: true
        }
        this.addCanvasElementHistory(newElement)
        return newElement
      }
    }
  }

  undo (): CanvasElement | void {
    const undoRedo = new UndoRedo()
    const foundElement = undoRedo.findUndo([...this.canvasElementsHistory])
    if (foundElement) {
      const canvasElement = this.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === foundElement.id)
      if (canvasElement) {
        canvasElement.tracker = (canvasElement.tracker === Tracker.ADDITION ? Tracker.REMOVAL : Tracker.ADDITION)
        const newElement: CanvasElement = {
          id: canvasElement.id,
          tool: canvasElement.tool,
          data: canvasElement.data,
          layerId: canvasElement.layerId,
          jti: canvasElement.jti,
          tracker: Tracker.UNDO,
          change: true,
          hasMoved: true
        }
        this.addCanvasElementHistory(newElement)
        return newElement
      }
    }
  }

  get stageNode () {
    return this.$refs.stage.getNode()
  }

  get layerNode () {
    return this.$refs.layer.getNode()
  }
  // eslint-disable-next-line
  [key: string]: any
}
</script>
<style scoped lang="scss">
.konva-stage {
  background-color: white;
  position: absolute;
  /* These are FA icons and might need replacing. */
  &.ping::v-deep canvas {
    cursor: pointer;
  }
  &.line::v-deep canvas {
    cursor: url('~@/assets/cursor/pen.png'), auto;
  }
  &.freedraw::v-deep canvas {
    cursor: url('~@/assets/cursor/pen.png'), auto;
  }
  &.erase::v-deep canvas {
    cursor: url('~@/assets/cursor/eraser.png'), auto;
  }
  &.circle::v-deep canvas {
    cursor: url('~@/assets/cursor/circle.png'), auto;
  }
  /* Extra Tools Here */
}
</style>
