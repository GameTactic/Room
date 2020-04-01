import { TextInterface, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import TextCreator from '@/tools/shapes/TextCreator'
import { EventBus } from '@/event-bus'

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
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    canvasElement.tracker = Tracker.ADDITION
    canvasElement.hasMoved = true
    canvasElement.tool = {
      name: this.name,
      size: this.size,
      colour: this.colour,
      temporary: this.temporary,
      textString: this.textString
    }
  }

  // eslint-disable-next-line
  mouseMoveAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
  }

  // eslint-disable-next-line
  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.textCreator = new TextCreator(
      this.temporary,
      this.size,
      this.colour,
      this.textString
    )
    this.textCreator.create(canvasElement, layer)
    canvasElement.position = this.textCreator.getGroup().position()
    const textArea = this.textCreator.createTextArea(canvasElement, layer)
    const canvasElementCopy = { ...canvasElement }
    const keyBoardEvent = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) { textArea.blur() }
    }
    const focusOutEvent = () => {
      canvasElementCopy.tool.textString = textArea.value
      textArea.remove()
      EventBus.$emit('addText', canvasElementCopy)
    }
    const onClickEvent = () => { textArea.blur() }
    textArea.addEventListener('mousedown', onClickEvent)
    textArea.addEventListener('keydown', keyBoardEvent)
    textArea.addEventListener('focusout', focusOutEvent)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (canvasElement.hasMoved) {
      this.textCreator = new TextCreator(
        canvasElement.tool.temporary || this.temporary,
        canvasElement.tool.size || this.size,
        canvasElement.tool.colour || this.colour,
        canvasElement.tool.textString || this.textString
      )
      this.textCreator.create(canvasElement, layer)
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
    socket.send(JSON.stringify(data))
  }
}
