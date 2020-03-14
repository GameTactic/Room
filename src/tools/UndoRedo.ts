import { CanvasElement } from '@/types/Canvas'
import { Tracker } from '@/tools/Tool'

export default class UndoRedo {
  findUndo (canvasElementsHistory: CanvasElement[]): CanvasElement | void {
    const lastElement = canvasElementsHistory[(canvasElementsHistory.length - 1)]
    if (lastElement) {
      if (lastElement.tracker === Tracker.ADDITION || lastElement.tracker === Tracker.REMOVAL) {
        return lastElement
      } else if (lastElement.tracker === Tracker.REDO) {
        const canvasElement: CanvasElement = {
          id: lastElement.id,
          layerId: lastElement.layerId,
          tracker: Tracker.UNDO,
          data: lastElement.data,
          jti: lastElement.jti,
          tool: lastElement.tool,
          change: true
        }
        return canvasElement
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
          copy.splice((copy.length - 1), 1)
          return this.findUndo(copy)
        }
      }
    }
  }

  findRedo (canvasElementsHistory: CanvasElement[]): CanvasElement | void {
    const lastElement = canvasElementsHistory[(canvasElementsHistory.length - 1)]
    if (lastElement) {
      if (lastElement.tracker === Tracker.ADDITION || lastElement.tracker === Tracker.REMOVAL) {
        return undefined
      } else if (lastElement.tracker === Tracker.UNDO) {
        const canvasElement: CanvasElement = {
          id: lastElement.id,
          layerId: lastElement.layerId,
          tracker: Tracker.REDO,
          data: lastElement.data,
          jti: lastElement.jti,
          tool: lastElement.tool,
          change: true
        }
        return canvasElement
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
          copy.splice((copy.length - 1), 1)
          return this.findRedo(copy)
        }
      }
    }
  }
  // eslint-disable-next-line
  [key: string]: any
}
