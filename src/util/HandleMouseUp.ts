import { CanvasElement } from '@/types/Canvas'
import { ToolInterface, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CustomEvent } from '@/util/PointerEventMapper'

export interface MouseUpCallback {
  change: MouseUpChange;
  payload: {
    canvasElement?: CanvasElement;
    canvasElementHistory?: CanvasElement;
    groupIds?: string[];
  };
}

export enum MouseUpChange {
  ADD = 'add',
  ADD_AND_HISTORY = 'addAndHistory',
  ADD_HISTORY = 'addHistory',
  HIDE = 'hide'
}

export default class HandleMouseUp {
  // eslint-disable-next-line no-useless-constructor
  constructor (public canvasElement: CanvasElement,
               public enabledTool: ToolInterface,
               public layer: Konva.Layer,
               public canvasElements: CanvasElement[],
               public event: CustomEvent) {
  }

  handle = (): MouseUpCallback | undefined => {
    if (!this.enabledTool.temporary) {
      if (this.enabledTool.name === 'erase' && this.canvasElement.tool.erase) {
        return {
          change: MouseUpChange.HIDE,
          payload: {
            groupIds: this.canvasElement.tool.erase
          }
        }
      } else if (this.enabledTool.name === 'text') {
        return undefined
      } else if (this.canvasElement.tracker === Tracker.MOVE) {
        const response = this.handleMove(this.canvasElement)
        if (response) {
          return {
            change: MouseUpChange.ADD_HISTORY,
            payload: {
              canvasElementHistory: response
            }
          }
        }
      } else {
        if (this.canvasElement.hasMoved) {
          return {
            change: MouseUpChange.ADD_AND_HISTORY,
            payload: {
              canvasElementHistory: { ...this.canvasElement },
              canvasElement: {
                ...this.canvasElement
              }
            }
          }
        }
      }
    }
  }

  handleMove = (canvasElement: CanvasElement): CanvasElement | undefined => {
    const foundElement = this.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === this.canvasElement.id)
    if (foundElement) {
      const previousPosition = { ...foundElement.position }
      foundElement.position = this.canvasElement.position
      canvasElement.position = {
        x: canvasElement.position.x - previousPosition.x,
        y: canvasElement.position.y - previousPosition.y
      }
      canvasElement.change = true
      return { ...canvasElement }
    }
  }
}
