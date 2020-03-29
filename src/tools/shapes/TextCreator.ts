import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import { Shape } from '@/tools/shapes/Shape'

export default class TextCreator implements Shape {
  private text: Konva.Text
  private group: Konva.Group
  private textArea: HTMLTextAreaElement
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public size?: number,
               public colour?: string,
               public textString?: string) {
    this.text = new Konva.Text()
    this.group = new Konva.Group()
    document.body.append(
      this.textArea = document.createElement('textarea')
    )
  }

  // eslint-disable-next-line
  create = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.group.attrs.temporary = this.temporary
    this.group.id(canvasElement.id).add(
      this.text = this.createTextElement(canvasElement)
    )
    if (this.text.getTextWidth() > (layer.getWidth() - this.text.getAbsolutePosition().x)) {
      this.text.width(layer.getWidth() - this.text.getAbsolutePosition().x)
    }
    layer.add(this.group)
  }

  createTextElement = (canvasElement: CanvasElement, colour?: string, size?: number, textString?: string): Konva.Shape & Konva.Text => {
    let fontSize = size || canvasElement.tool.size || this.size
    if (fontSize) {
      fontSize = fontSize * 5
    } else {
      fontSize = 25
    }
    return new Konva.Text({
      globalCompositeOperation: 'source-over',
      text: textString || canvasElement.tool.textString || this.textString,
      x: canvasElement.data[0],
      y: canvasElement.data[1],
      fill: colour || canvasElement.tool.colour || this.colour,
      fontSize: fontSize,
      hitStrokeWidth: this.hitStroke,
      id: canvasElement.id,
      wrap: 'word'
    })
  }

  createText = (canvasElement: CanvasElement, layer: Konva.Layer, textArea?: HTMLTextAreaElement): string | void => {
    if (textArea) {
      const textString = textArea.value
      this.text.setText(textString)
      textArea.remove()
      this.group.add(this.text)
      layer.add(this.group)
      layer.batchDraw()
      return textString
    }
  }

  styleTextArea = (canvasElement: CanvasElement, textArea: HTMLTextAreaElement, layer: Konva.Layer): HTMLTextAreaElement => {
    // These styles are comming from Konva.Text documentation
    textArea.placeholder = 'Write text here'
    textArea.id = canvasElement.id
    textArea.style.position = 'absolute'
    textArea.style.top = this.text.getAbsolutePosition().y - 2 + 'px'
    textArea.style.left = this.text.getAbsolutePosition().x + 'px'
    textArea.style.color = this.text.fill()
    textArea.style.textAlign = this.text.align()
    textArea.style.transformOrigin = 'left top'
    textArea.style.fontSize = this.text.fontSize() + 'px'
    textArea.style.border = 'none'
    textArea.style.padding = '0px'
    textArea.style.width = (window.innerWidth - this.text.getAbsolutePosition().x) + 'px'
    textArea.style.overflowX = 'hidden'
    textArea.style.margin = '0px'
    textArea.style.overflow = 'hidden'
    textArea.style.background = 'none'
    textArea.style.outline = 'none'
    textArea.style.resize = 'none'
    textArea.style.lineHeight = this.text.lineHeight().toString()
    textArea.style.fontFamily = this.text.fontFamily()
    textArea.spellcheck = false
    textArea.style.height = (layer.getHeight() - this.text.getAbsolutePosition().y) + 'px'
    return textArea
  }

  createTextArea = (canvasElement: CanvasElement, layer: Konva.Layer): HTMLTextAreaElement => {
    this.textArea = this.styleTextArea(canvasElement, this.textArea, layer)
    this.textArea.focus()
    return this.textArea
  }

  getGroup = (): Konva.Group => {
    return this.group
  }
}
