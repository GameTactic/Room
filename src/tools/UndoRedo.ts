import { CanvasElement } from '@/types/Canvas'
import { Tracker } from '@/tools/Tool'

export default class UndoRedo {
  findUndo (canvasElementsHistory: CanvasElement[]): CanvasElement | void {
    const lastElement = canvasElementsHistory[(canvasElementsHistory.length - 1)]
    if (lastElement) {
      if (lastElement.tracker !== Tracker.UNDO && lastElement.tracker !== Tracker.REDO) {
        return lastElement
      } else if (lastElement.tracker === Tracker.REDO) {
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
