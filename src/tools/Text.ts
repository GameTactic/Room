import { TextData, TextInterface, ToolClass, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import TextCreator from '@/tools/shapes/TextCreator'
import { CustomEvent } from '@/util/PointerEventMapper'
import { ISO } from '@/util/ISO'
import uuid from 'uuid'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'

export default class Text extends ToolClass implements TextInterface {
  private textCreator: TextCreator
  private data: TextData = { point: { x: 0, y: 0 } }
  private groupId = uuid()
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
      this.textString,
      this.groupId,
      this.data.point
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
      this.groupId = uuid()
      this.data = {
        point: { x: event.globalOffset.x, y: event.globalOffset.y }
      }
      this.textCreator = new TextCreator(
        this.temporary,
        this.size,
        this.colour,
        this.textString,
        this.groupId,
        {
          x: this.formatX(this.data.point.x),
          y: this.formatY(this.data.point.y)
        }
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
        this.textString = textArea.value
        textArea.remove()
        if (this.textString && this.textString.length > 0 && this.jti) {
          this.textCreator.textString = this.textString
          this.textCreator.create()
          this.sendAndAddToState({
            id: uuid(),
            jti: this.jti,
            modifyType: Tracker.ADDITION,
            modifyData: {
              additions: [this.groupId],
              tool: AdditionTools.TEXT
            },
            canvasElements: [{
              id: this.groupId,
              tool: {
                name: this.name,
                size: this.size,
                colour: this.colour,
                temporary: this.temporary,
                textString: this.textString
              } as TextInterface,
              type: CanvasElementType.SHAPE,
              data: this.data,
              jti: this.jti,
              isVisible: true,
              layerId: this.layer.id(),
              attrs: {
                position: {
                  x: this.formatXInverse(this.textCreator.getGroup().position().x),
                  y: this.formatYInverse(this.textCreator.getGroup().position().y)
                },
                rotation: this.textCreator.getGroup().rotation(),
                skewX: this.textCreator.getGroup().skewX(),
                skewY: this.textCreator.getGroup().skewY(),
                scaleX: this.textCreator.getGroup().scaleX(),
                scaleY: this.textCreator.getGroup().scaleY()
              }
            }],
            timestampModified: ISO.timestamp()
          }, SocketCanvasToolsEmit.CANVAS_TOOLS_TEXT)
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
        const tool = canvasElement.tool as TextInterface
        this.textCreator = new TextCreator(
          tool.temporary,
          tool.size,
          tool.colour,
          tool.textString,
          canvasElement.id,
          {
            x: this.formatX(data.point.x),
            y: this.formatY(data.point.y)
          }
        )
        this.textCreator.create()
        if (canvasElement.tool.temporary) {
          this.textCreator.runTemporaryAnimation(this.textCreator.getGroup())
        } else {
          this.layer.batchDraw()
        }
      }
    })
  }
}
