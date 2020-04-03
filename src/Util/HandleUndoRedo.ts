import { CanvasElement } from '@/types/Canvas'
import { Tracker } from '@/tools/Tool'

export interface HandleUndoRedoCallback {
  addToHistory: CanvasElement;
  returnElement: CanvasElement;
}

export default class HandleUndoRedo {
  // eslint-disable-next-line no-useless-constructor
  constructor (public canvasElementsHistory: CanvasElement[],
               public canvasElements: CanvasElement[]) {
  }

  handleUndoRedo = (undoRedoString: string): HandleUndoRedoCallback | undefined => {
    const foundElement = this['find' + undoRedoString]([...this.canvasElementsHistory])
    if (foundElement) {
      const element = this.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === foundElement.id)
      if (element) {
        const canvasElement: CanvasElement = this.computeChange(element, foundElement, undoRedoString)
        const newElement: CanvasElement = { ...canvasElement }
        newElement.tracker = (undoRedoString === 'Undo' ? Tracker.UNDO : Tracker.REDO)
        newElement.change = true
        newElement.hasMoved = true
        const addToHistory: CanvasElement = { ...newElement }
        newElement.tracker = foundElement.tracker
        return {
          addToHistory: addToHistory,
          returnElement: newElement
        }
      }
    }
  }

  computeChange = (canvasElement: CanvasElement, foundElement: CanvasElement, undoRedoString: string): CanvasElement => {
    if (foundElement.tracker !== Tracker.MOVE) {
      canvasElement.tracker = (canvasElement.tracker === Tracker.ADDITION ? Tracker.REMOVAL : Tracker.ADDITION)
    } else {
      if (undoRedoString === 'Undo') {
        canvasElement.position = {
          x: (canvasElement.position.x - foundElement.position.x),
          y: (canvasElement.position.y - foundElement.position.y)
        }
      } else if (undoRedoString === 'Redo') {
        canvasElement.position = {
          x: (canvasElement.position.x + foundElement.position.x),
          y: (canvasElement.position.y + foundElement.position.y)
        }
      }
    }
    return canvasElement
  }

  findUndo (canvasElementsHistory: CanvasElement[]): CanvasElement | void {
    const lastElement = canvasElementsHistory[(canvasElementsHistory.length - 1)]
    if (lastElement) {
      if (lastElement.tracker === Tracker.REDO) {
        const copy = [...canvasElementsHistory]
        copy.pop()
        return this.findRedo(copy)
      } else if (lastElement.tracker === Tracker.UNDO) {
        let foundElementIndex = -1
        const copy = [...canvasElementsHistory]
        for (let i = copy.length - 1; i >= 0; i--) {
          if ((copy[i].id === lastElement.id) && copy[i].tracker !== Tracker.UNDO) {
            foundElementIndex = i
            break
          }
        }
        if (foundElementIndex >= 0) {
          copy.splice(foundElementIndex, 1)
          copy.pop()
          return this.findUndo(copy)
        }
      } else {
        return lastElement
      }
    }
  }

  findRedo (canvasElementsHistory: CanvasElement[]): CanvasElement | void {
    const lastElement = canvasElementsHistory[(canvasElementsHistory.length - 1)]
    if (lastElement) {
      if (lastElement.tracker === Tracker.UNDO) {
        const copy = [...canvasElementsHistory]
        copy.pop()
        return this.findUndo(copy)
      } else if (lastElement.tracker === Tracker.REDO) {
        let foundElementIndex = -1
        const copy = [...canvasElementsHistory]
        for (let i = copy.length - 1; i >= 0; i--) {
          if ((copy[i].id === lastElement.id) && copy[i].tracker !== Tracker.REDO) {
            foundElementIndex = i
            break
          }
        }
        if (foundElementIndex >= 0) {
          copy.splice(foundElementIndex, 1)
          copy.pop()
          return this.findRedo(copy)
        }
      } else {
        return undefined
      }
    }
  }
  // eslint-disable-next-line
  [key: string]: any
}
