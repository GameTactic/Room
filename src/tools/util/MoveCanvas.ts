import { CanvasToolInterface } from '@/tools/Tool'
import { VueKonvaStage } from '@/types/Canvas'
import { CustomEvent } from '@/util/PointerEventMapper'

export default class MoveCanvas implements CanvasToolInterface {
  // eslint-disable-next-line no-useless-constructor
  public startPos: {
    pointer: {
      x: number;
      y: number;
    };
    element: {
      x: number;
      y: number;
    };
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
  // eslint-disable-next-line
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

  // eslint-disable-next-line
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
