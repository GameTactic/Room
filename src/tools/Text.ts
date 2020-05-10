import { TextData, TextInterface, ToolClass, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import TextCreator from '@/tools/shapes/TextCreator'
import { CustomEvent } from '@/util/PointerEventMapper'
import { ISO } from '@/util/ISO'
import uuid from 'uuid'

export default class Text extends ToolClass implements TextInterface {
  private textCreator: TextCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean,
               public textString: string) {
    super()
    this.textCreator = new TextCreator(
      this.temporary,
      this.size,
      this.colour,
      this.textString
    )
  }

  // eslint-disable-next-line
  mouseDownAction = (event: CustomEvent): void => {
  }

  // eslint-disable-next-line
  mouseMoveAction = (event: CustomEvent): void => {
  }

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    const target = event.konvaPointerEvent.target
    if (target instanceof Konva.Stage || target instanceof Konva.Node) {
      this.enableTool()
      this.resetCanvasEntity()
      this.canvasElement.type = CanvasElementType.SHAPE
      this.canvasElement.isVisible = true
      this.canvasElement.data = {
        point: { x: event.globalOffset.x, y: event.globalOffset.y }
      }
      this.canvasElement.tool = {
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
      const textArea = this.textCreator.createTextArea(event)
      const inputEvent = () => {
        const maxDimensions = {
          maxWidth: parseInt(textArea.style.maxWidth.substring(0, textArea.style.maxWidth.length - 2)),
          maxHeight: parseInt(textArea.style.maxHeight.substring(0, textArea.style.maxHeight.length - 2))
        }
        if (maxDimensions.maxWidth < textArea.scrollWidth) {
          textArea.value = [textArea.value.slice(0, textArea.value.length - 1), '\n', textArea.value.slice(textArea.value.length - 1)].join('')
        }
        if (maxDimensions.maxHeight < textArea.scrollHeight) {
          textArea.value = textArea.value.slice(0, textArea.value.length - 2)
        }
        textArea.style.height = '30px'
        textArea.style.width = '100px'
        textArea.style.height = `${textArea.scrollHeight}px`
        textArea.style.width = `${textArea.scrollWidth}px`
      }
      const keyBoardEvent = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          textArea.blur()
        }
      }
      const focusOutEvent = () => {
        this.disableTool()
        this.canvasElement.tool.textString = textArea.value
        textArea.remove()
        this.textCreator.create(event)
        this.canvasElement.position = this.textCreator.getGroup().getPosition()
        if (this.canvasElement.tool.textString && this.canvasElement.tool.textString?.length > 0) {
          this.sendAndAddToState({
            id: uuid(),
            jti: this.canvasElement.jti,
            modifyType: Tracker.ADDITION,
            modifyData: {
              additions: [this.canvasElement.id],
              tool: AdditionTools.TEXT
            },
            canvasElements: [this.canvasElement],
            timestampModified: ISO.timestamp()
          })
        }
      }
      const onClickEvent = () => {
        textArea.blur()
      }
      const pasteEvent = (e: ClipboardEvent) => {
        e.preventDefault()
      }
      textArea.addEventListener('mousedown', onClickEvent)
      textArea.addEventListener('keydown', keyBoardEvent)
      textArea.addEventListener('focusout', focusOutEvent)
      textArea.addEventListener('input', inputEvent)
      textArea.addEventListener('paste', pasteEvent)
    }
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as TextData
      if (data.point) {
        this.textCreator = new TextCreator(
          canvasElement.tool.temporary || this.temporary,
          canvasElement.tool.size || this.size,
          canvasElement.tool.colour || this.colour,
          canvasElement.tool.textString || this.textString
        )
        this.textCreator.create(this.stageEvent, canvasElement)
        if (canvasElement.tool.temporary) {
          this.textCreator.runTemporaryAnimation(this.textCreator.getGroup())
        } else {
          this.layer.batchDraw()
        }
      }
    })
  }
}
