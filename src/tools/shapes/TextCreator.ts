import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import Shape, { TextCreatorInterface } from '@/tools/shapes/Shape'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'
import { TextData } from '@/tools/Tool'

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
  create = (event: CustomEvent | CustomStageEvent, canvasElement?: CanvasElement): void => {
    if (!canvasElement) { canvasElement = this.canvasElement }
    this.group.id(canvasElement.id).add(
      this.text = this.createTextElement(canvasElement, event)
    )
    this.layer.add(this.group).batchDraw()
  }

  createTextElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, colour?: string, size?: number, textString?: string): Konva.Shape & Konva.Text => {
    let fontSize = size || canvasElement.tool.size || this.size
    if (fontSize) {
      fontSize = fontSize * 5
    } else {
      fontSize = 25
    }
    const data = canvasElement.data as TextData
    return new Konva.Text({
      globalCompositeOperation: 'source-over',
      text: textString || canvasElement.tool.textString || this.textString,
      x: this.formatX(data.point.x, event),
      y: this.formatY(data.point.y, event),
      fill: colour || canvasElement.tool.colour || this.colour,
      fontSize: fontSize,
      hitStrokeWidth: this.hitStroke,
      id: canvasElement.id,
      fontFamily: this.fontFamily,
      lineHeight: this.lineHeight,
      width: (this.layer.getWidth() - (data.point.x * event.stageConfig.scale.x)) / event.stageConfig.scale.x,
      wrap: 'char'
    })
  }

  styleTextArea = (textArea: HTMLTextAreaElement, event: CustomEvent): HTMLTextAreaElement => {
    let fontSize = this.canvasElement.tool.size || this.size
    if (fontSize) {
      fontSize = fontSize * 5
    } else {
      fontSize = 25
    }
    textArea.placeholder = 'Write text here'
    textArea.id = this.canvasElement.id
    textArea.style.position = 'absolute'
    textArea.style.top = event.pointerEvent.pageY + 'px'
    textArea.style.left = event.pointerEvent.pageX + 'px'
    textArea.style.color = this.canvasElement.tool.colour
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
    textArea.style.height = (this.layer.getHeight() - event.offset.y) + 'px'
    textArea.style.width = (this.layer.getWidth() - event.offset.x) + 'px'
    return textArea
  }

  createTextArea = (event: CustomEvent): HTMLTextAreaElement => {
    this.textArea = this.styleTextArea(this.textArea, event)
    this.textArea.focus()
    return this.textArea
  }
}
