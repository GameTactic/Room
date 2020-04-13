import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import Shape, { TextCreatorInterface } from '@/tools/shapes/Shape'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

export default class TextCreator extends Shape implements TextCreatorInterface {
  private fontFamily = 'arial'
  private lineHeight = 1
  private text: Konva.Text
  private textArea: HTMLTextAreaElement
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public size: number,
               public colour: string,
               public textString: string) {
    super()
    this.text = new Konva.Text()
    document.body.append(
      this.textArea = document.createElement('textarea')
    )
  }

  // eslint-disable-next-line
  create = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    this.group.attrs.temporary = this.temporary
    this.group.id(canvasElement.id).add(
      this.text = this.createTextElement(canvasElement, layer, event)
    )
    layer.add(this.group)
  }

  createTextElement = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent, colour?: string, size?: number, textString?: string): Konva.Shape & Konva.Text => {
    let fontSize = size || canvasElement.tool.size || this.size
    if (fontSize) {
      fontSize = fontSize * 5
    } else {
      fontSize = 25
    }
    return new Konva.Text({
      globalCompositeOperation: 'source-over',
      text: textString || canvasElement.tool.textString || this.textString,
      x: this.formatX(canvasElement.data[0], event),
      y: this.formatY(canvasElement.data[1], event),
      fill: colour || canvasElement.tool.colour || this.colour,
      fontSize: fontSize,
      hitStrokeWidth: this.hitStroke,
      id: canvasElement.id,
      fontFamily: this.fontFamily,
      lineHeight: this.lineHeight,
      width: (layer.getWidth() - (canvasElement.data[0] * event.stageConfig.scale.x)) / event.stageConfig.scale.x,
      wrap: 'char'
    })
  }

  styleTextArea = (canvasElement: CanvasElement, textArea: HTMLTextAreaElement, layer: Konva.Layer, event: CustomEvent): HTMLTextAreaElement => {
    let fontSize = canvasElement.tool.size || this.size
    if (fontSize) {
      fontSize = fontSize * 5
    } else {
      fontSize = 25
    }
    textArea.placeholder = 'Write text here'
    textArea.id = canvasElement.id
    textArea.style.position = 'absolute'
    textArea.style.top = event.pointerEvent.pageY + 'px'
    textArea.style.left = event.pointerEvent.pageX + 'px'
    textArea.style.color = canvasElement.tool.colour
    textArea.style.transformOrigin = 'left top'
    textArea.style.fontSize = fontSize * (event.stageConfig.width / event.stageConfig.initialWidth) + 'px'
    textArea.style.border = 'none'
    textArea.style.padding = '0px'
    textArea.style.margin = '0px'
    textArea.style.overflow = 'hidden'
    textArea.style.background = 'none'
    textArea.style.outline = 'none'
    textArea.style.resize = 'none'
    textArea.style.lineHeight = this.lineHeight.toString()
    textArea.style.fontFamily = this.fontFamily
    textArea.spellcheck = false
    textArea.style.height = (layer.getHeight() - event.offset.y) + 'px'
    textArea.style.width = (layer.getWidth() - event.offset.x) + 'px'
    return textArea
  }

  createTextArea = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent): HTMLTextAreaElement => {
    this.textArea = this.styleTextArea(canvasElement, this.textArea, layer, event)
    this.textArea.focus()
    return this.textArea
  }
}
