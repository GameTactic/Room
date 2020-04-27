import { TextInterface, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import TextCreator from '@/tools/shapes/TextCreator'
import { EventBus } from '@/event-bus'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

export default class Text implements TextInterface {
  private textCreator: TextCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean,
               public textString: string) {
    this.textCreator = new TextCreator(
      this.temporary,
      this.size,
      this.colour,
      this.textString
    )
  }

  // eslint-disable-next-line
  mouseDownAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {

  }

  // eslint-disable-next-line
  mouseMoveAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
  }

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    const target = event.konvaPointerEvent.target
    if (target instanceof Konva.Stage || target instanceof Konva.Node) {
      canvasElement.data = [event.globalOffset.x, event.globalOffset.y]
      canvasElement.id = uuid()
      canvasElement.tracker = Tracker.ADDITION
      canvasElement.hasMoved = true
      canvasElement.position = { x: 0, y: 0 }
      canvasElement.tool = {
        name: this.name,
        size: this.size,
        colour: this.colour,
        temporary: this.temporary,
        textString: this.textString
      }
      this.textCreator = new TextCreator(
        this.temporary,
        this.size,
        this.colour,
        this.textString
      )
      const textArea = this.textCreator.createTextArea(canvasElement, layer, event)
      const canvasElementCopy = { ...canvasElement }
      const inputEvent = () => {
        if ((textArea.scrollHeight - 1) > textArea.getBoundingClientRect().height) {
          textArea.value = textArea.value.slice(0, -1)
        }
      }
      const keyBoardEvent = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          textArea.blur()
        }
      }
      const focusOutEvent = () => {
        canvasElementCopy.tool.textString = textArea.value
        textArea.remove()
        EventBus.$emit('addText', canvasElementCopy)
      }
      const onClickEvent = () => {
        textArea.blur()
      }
      textArea.addEventListener('mousedown', onClickEvent)
      textArea.addEventListener('keydown', keyBoardEvent)
      textArea.addEventListener('focusout', focusOutEvent)
      textArea.addEventListener('input', inputEvent)
    }
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    if (canvasElement.hasMoved) {
      this.textCreator = new TextCreator(
        canvasElement.tool.temporary || this.temporary,
        canvasElement.tool.size || this.size,
        canvasElement.tool.colour || this.colour,
        canvasElement.tool.textString || this.textString
      )
      this.textCreator.create(canvasElement, layer, event)
      layer.batchDraw()
      if (canvasElement.tool.temporary) {
        this.textCreator.runTemporaryAnimation(this.textCreator.getGroup(), layer)
      }
    }
  }

  sendToWebSocket = (canvasElement: CanvasElement, socket: WebSocket) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: this.name,
        colour: this.colour,
        size: this.size,
        temporary: this.temporary,
        textString: this.textString
      },
      data: canvasElement.data,
      tracker: Tracker.ADDITION,
      change: false,
      hasMoved: canvasElement.hasMoved,
      position: canvasElement.position
    }
    // socket.send(JSON.stringify(data))
  }
}
