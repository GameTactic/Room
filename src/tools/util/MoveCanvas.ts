import { CanvasToolInterface } from '@/tools/Tool'
import { VueKonvaStage } from '@/types/Canvas'
import { CustomEvent, Point } from '@/util/PointerEventMapper'

export default class MoveCanvas implements CanvasToolInterface {
  public startPos: {
    pointer: Point;
    element: Point;
  }
  constructor (public name: string) {
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

  canvasDownAction = (event: CustomEvent, stage: VueKonvaStage): void => {
    this.startPos = {
      pointer: {
        x: event.konvaPointerEvent.evt.x,
        y: event.konvaPointerEvent.evt.y
      },
      element: {
        x: stage.$el.getBoundingClientRect().x,
        y: stage.$el.getBoundingClientRect().y
      }
    }
  }

  canvasMoveAction = (event: CustomEvent, stage: VueKonvaStage): void => {
    const newPosition = {
      x: event.konvaPointerEvent.evt.x - this.startPos.pointer.x,
      y: event.konvaPointerEvent.evt.y - this.startPos.pointer.y
    }
    stage.$el.setAttribute('style',
      'left: ' + (newPosition.x + this.startPos.element.x) + 'px; top: ' + (newPosition.y + this.startPos.element.y) + 'px;'
    )
  }

  // eslint-disable-next-line
  canvasUpAction = (event: CustomEvent, stage: VueKonvaStage): void => {
  }
}
