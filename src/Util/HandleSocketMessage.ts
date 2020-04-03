import { CanvasElement } from '@/types/Canvas'
import { Tool, Tracker } from '@/tools/Tool'
import Konva from 'konva'

export interface SocketHandlerCallback {
  change: SocketHandlerChange;
  payload: {
    canvasElement?: CanvasElement;
    groupIds?: string[];
  };
}

export enum SocketHandlerChange {
  ADD = 'add',
  HIDE = 'hide'
}

export default class HandleSocketMessage {
  // eslint-disable-next-line no-useless-constructor
  constructor (public canvasElement: CanvasElement,
               public currentElement: CanvasElement,
               public tools: Tool[],
               public layer: Konva.Layer,
               public canvasElements: CanvasElement[]) {
  }

  handle = (): SocketHandlerCallback | undefined => {
    if (!this.checkIsUndefined()) {
      if (this.canvasElement.layerId !== this.currentElement.layerId) {
        if (this.canvasElement.tool.temporary) {
          this.renderCanvas(this.tools, this.canvasElement, this.layer)
        } else {
          if (this.canvasElement.change) {
            this.handleChange()
          } else if (this.canvasElement.tool.name === 'erase' && this.canvasElement.tool.erase) {
            return {
              change: SocketHandlerChange.HIDE,
              payload: {
                groupIds: this.canvasElement.tool.erase
              }
            }
          } else {
            return {
              change: SocketHandlerChange.ADD,
              payload: {
                canvasElement: this.canvasElement
              }
            }
          }
        }
      }
    }
  }

  renderCanvas = (tools: Tool[], canvasElement: CanvasElement, layer: Konva.Layer): void => {
    const foundTool = tools.find((tool: Tool) => tool.name === canvasElement.tool.name)
    if (foundTool && foundTool.renderCanvas) {
      foundTool.renderCanvas(canvasElement, layer)
    }
  }

  handleChange = (): void => {
    const foundElement = this.canvasElements.find((element: CanvasElement) => element.id === this.canvasElement.id)
    if (foundElement) {
      if (this.canvasElement.tracker !== Tracker.MOVE) {
        foundElement.tracker = (foundElement.tracker === Tracker.ADDITION ? Tracker.REMOVAL : Tracker.ADDITION)
      } else {
        foundElement.position = this.canvasElement.position
      }
    }
  }

  checkIsUndefined = (): boolean => {
    return !(this.canvasElement && this.layer && this.canvasElements && this.tools && this.currentElement)
  }
}
