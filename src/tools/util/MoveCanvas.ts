import { CanvasToolInterface, ToolClass } from '@/tools/Tool'
import { CustomEvent, Point } from '@/util/PointerEventMapper'
import Konva from 'Konva'

export default class MoveCanvas extends ToolClass implements CanvasToolInterface {
  public startPos: {
    pointer: Point;
    element: Point;
  }
  constructor (public name: string,
               public temporary: boolean) {
    super()
    this.startPos = {
      pointer: {
        x: 0,
        y: 0
      },
      element: {
        x: 0,
        y: 0
      }
    }
  }

  canvasDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.startPos = {
      pointer: {
        x: event.konvaPointerEvent.evt.x,
        y: event.konvaPointerEvent.evt.y
      },
      element: {
        x: this.stageEvent.stage.content.getBoundingClientRect().left,
        y: this.stageEvent.stage.content.getBoundingClientRect().top
      }
    }
  }

  // eslint-disable-next-line
  canvasMoveAction = (event: CustomEvent, stage: Konva.Stage): void => {
    if (this.enabled) {
      const newPosition = {
        x: event.konvaPointerEvent.evt.x - this.startPos.pointer.x + this.startPos.element.x,
        y: event.konvaPointerEvent.evt.y - this.startPos.pointer.y + this.startPos.element.y
      }
      this.stageEvent.stage.attrs.container.setAttribute('style',
        `left: ${newPosition.x}px; top: ${newPosition.y}px;`
      )
    }
  }

  // eslint-disable-next-line
  canvasUpAction = (event: CustomEvent, stage: Konva.Stage): void => {
    if (this.enabled) { this.disableTool() }
  }
}
