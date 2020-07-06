import Konva from 'konva'
import { CanvasElementType, Point } from '@/types/canvas'
import Shape, { TextCreatorInterface } from '@/tools/shapes/shape'
import { v4 as uuid } from 'uuid'
import { CustomEvent } from '@/util/pointerEventMapper'

export default class TextCreator extends Shape implements TextCreatorInterface {
  private fontFamily = 'arial'
  private lineHeight = 1
  private text: Konva.Text
  private textArea: HTMLTextAreaElement | undefined
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public size: number,
               public colour: string,
               public textString: string,
               public groupId: string,
               public point: Point) {
    super()
    this.text = new Konva.Text()
  }

  create = (): void => {
    this.group.id(this.groupId).add(
      this.text = this.createTextElement()
    )
    this.group.attrs.type = CanvasElementType.SHAPE
    this.group.attrs.temporary = this.temporary
    this.layer.add(this.group).batchDraw()
  }

  createTextElement = (): Konva.Shape & Konva.Text => {
    return new Konva.Text({
      globalCompositeOperation: 'source-over',
      text: this.textString,
      x: this.point.x,
      y: this.point.y,
      fill: this.colour,
      fontSize: (this.size) ? this.size * 5 : 25,
      hitStrokeWidth: this.hitStroke,
      id: uuid(),
      fontFamily: this.fontFamily,
      lineHeight: this.lineHeight,
      wrap: 'char'
    })
  }

  styleTextArea = (textArea: HTMLTextAreaElement, event: CustomEvent): HTMLTextAreaElement => {
    textArea.setAttribute('wrap', 'off')
    textArea.placeholder = 'Write text here'
    textArea.id = this.groupId
    textArea.style.position = 'absolute'
    textArea.style.overflow = 'hidden'
    textArea.style.top = event.pointerEvent.pageY + 'px'
    textArea.style.left = event.pointerEvent.pageX + 'px'
    textArea.style.color = this.colour
    textArea.style.transformOrigin = 'left top'
    textArea.style.fontSize = ((this.size) ? this.size * 5 : 25) * (this.stageConfig.width / this.stageConfig.initialWidth) + 'px'
    textArea.style.border = 'none'
    textArea.style.padding = '0px'
    textArea.style.margin = '0px'
    textArea.style.background = 'none'
    textArea.style.outline = 'none'
    textArea.style.resize = 'none'
    textArea.style.lineHeight = this.lineHeight.toString()
    textArea.style.fontFamily = this.fontFamily
    textArea.spellcheck = false
    textArea.style.maxHeight = (this.layer.getHeight() - event.offset.y) + 'px'
    textArea.style.maxWidth = (this.layer.getWidth() - event.offset.x) + 'px'
    return textArea
  }

  createTextArea = (event: CustomEvent): HTMLTextAreaElement => {
    this.textArea = this.initTextArea()
    this.textArea = this.styleTextArea(this.textArea, event)
    this.textArea.focus()
    return this.textArea
  }

  initTextArea = (): HTMLTextAreaElement => {
    const textArea = document.createElement('textarea')
    document.body.append(textArea)
    return textArea
  }
}
