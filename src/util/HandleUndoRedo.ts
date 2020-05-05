import {
  AdditionData,
  CanvasElement,
  CanvasElementHistory,
  MoveData,
  RedoData,
  RemovalData,
  UndoData
} from '@/types/Canvas'
import { Tracker } from '@/tools/Tool'
import { CanvasAction, CanvasGetters } from '@/store/modules/canvas'
import store from '@/main'
import { ISO } from '@/util/ISO'
import uuid from 'uuid'
import {AuthenticationGetters} from "@/store/modules/authentication";

export default class HandleUndoRedo {
  handleUndoRedo = (undoRedoString: string): void => {
    const canvasElementsHistory = (store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`])
    const foundElement: CanvasElementHistory = this['find' + undoRedoString](this.sortHistory([...canvasElementsHistory]))
    if (foundElement) {
      if (undoRedoString === 'Undo') {
        this.undo(Tracker.UNDO, { historyId: foundElement.id })
      } else if (undoRedoString === 'Redo') {
        this.redo(Tracker.REDO, foundElement)
      }
    }
  }

  findUndo (history: CanvasElementHistory[] | undefined): CanvasElementHistory | void {
    if (history) {
      const lastElement = history[(history.length - 1)]
      if (lastElement) {
        if (lastElement.modifyType === Tracker.REDO) {
          return this.findUndo(this.findSoulmate(history))
        } else if (lastElement.modifyType === Tracker.UNDO) {
          return this.findUndo(this.findSoulmate(history))
        } else {
          return lastElement
        }
      }
    }
  }

  findRedo (history: CanvasElementHistory[] | undefined): CanvasElementHistory | void {
    if (history) {
      const lastElement = history[(history.length - 1)]
      if (lastElement) {
        if (lastElement.modifyType === Tracker.REDO) {
          return this.findRedo(this.findSoulmate(history))
        } else if (lastElement.modifyType === Tracker.UNDO) {
          return lastElement
        } else {
          return undefined
        }
      }
    }
  }

  // Find soulmate and remove it and itself. Then return array
  findSoulmate (history: CanvasElementHistory[]): CanvasElementHistory[] | undefined {
    const lastElement = history[history.length - 1]
    const data = lastElement.modifyData as RedoData
    if (data.historyId) {
      const foundElement = history.find((item: CanvasElementHistory) => item.id === data.historyId)
      if (foundElement) {
        const index = history.indexOf(foundElement)
        if (index) {
          history.splice(index, 1)
          history.pop()
          return history
        }
      }
    }
    return undefined
  }

  getSoulmate (history: CanvasElementHistory[]): CanvasElementHistory | undefined {
    const lastElement = history[history.length - 1]
    const data = lastElement.modifyData as RedoData
    if (data.historyId) {
      return history.find((item: CanvasElementHistory) => item.id === data.historyId)
    }
  }

  undo (modifyType: Tracker, modifyData: UndoData) {
    const data: CanvasElementHistory = {
      id: uuid(),
      jti: (store.getters[`authentication/${AuthenticationGetters.JWT}`]).jti,
      modifyType: modifyType,
      modifyData: modifyData,
      timestampModified: ISO.timestamp()
    }
    const canvasElements = store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`]
    const canvasElementHistory = store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`]
    const undo: CanvasElementHistory = canvasElementHistory.find((history: CanvasElementHistory) => history.id === modifyData.historyId)
    if (undo) {
      switch (undo.modifyType) {
        case Tracker.ADDITION:
          this.undoAdditions(undo, canvasElements, data)
          break
        case Tracker.REMOVAL:
          this.undoRemovals(undo, canvasElements, data)
          break
        case Tracker.MOVE:
          this.undoMove(undo, canvasElements, data)
          break
      }
    }
  }

  redo (modifyType: Tracker, history: CanvasElementHistory) {
    const data: CanvasElementHistory = {
      id: uuid(),
      jti: (store.getters[`authentication/${AuthenticationGetters.JWT}`]).jti,
      modifyType: modifyType,
      modifyData: { historyId: history.id },
      timestampModified: ISO.timestamp()
    }
    const canvasElements = store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`]
    const canvasElementHistory = store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`]
    const modifier = history.modifyData as UndoData
    const redo: CanvasElementHistory = canvasElementHistory.find((history: CanvasElementHistory) => history.id === modifier.historyId)
    if (redo) {
      switch (redo.modifyType) {
        case Tracker.ADDITION:
          this.redoAdditions(redo, canvasElements, data)
          break
        case Tracker.REMOVAL:
          this.redoRemovals(redo, canvasElements, data)
          break
        case Tracker.MOVE:
          this.redoMove(redo, canvasElements, data)
          break
      }
    }
  }

  undoAdditions (history: CanvasElementHistory, canvasElements: CanvasElement[], canvasElementHistory: CanvasElementHistory) {
    const additions = (history.modifyData as AdditionData).additions
    if (additions) {
      additions.forEach((canvasElementId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === canvasElementId)
        if (foundElement) {
          store.dispatch(`canvas/${CanvasAction.HIDE_CANVAS_ELEMENT}`, foundElement)
        }
      })
      store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, canvasElementHistory)
    }
  }

  undoRemovals (history: CanvasElementHistory, canvasElements: CanvasElement[], canvasElementHistory: CanvasElementHistory) {
    const removals = (history.modifyData as RemovalData).removals
    if (removals) {
      removals.forEach((canvasElementId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === canvasElementId)
        if (foundElement) {
          store.dispatch(`canvas/${CanvasAction.SHOW_CANVAS_ELEMENT}`, foundElement)
        }
      })
      store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, canvasElementHistory)
    }
  }

  undoMove (history: CanvasElementHistory, canvasElements: CanvasElement[], canvasElementHistory: CanvasElementHistory) {
    const groups = (history.modifyData as MoveData).groups
    if (groups) {
      groups.forEach((groupId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === groupId)
        if (foundElement) {
          const data = history.modifyData as MoveData
          const prevPos = foundElement.position
          foundElement.position = {
            x: (data.to.x - data.from.x) - prevPos.x,
            y: (data.to.y - data.from.y) - prevPos.y
          }
        }
      })
      store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, canvasElementHistory)
    }
  }

  redoAdditions (history: CanvasElementHistory, canvasElements: CanvasElement[], canvasElementHistory: CanvasElementHistory) {
    const additions = (history.modifyData as AdditionData).additions
    if (additions) {
      additions.forEach((canvasElementId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === canvasElementId)
        if (foundElement) {
          store.dispatch(`canvas/${CanvasAction.SHOW_CANVAS_ELEMENT}`, foundElement)
        }
      })
      store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, canvasElementHistory)
    }
  }

  redoRemovals (history: CanvasElementHistory, canvasElements: CanvasElement[], canvasElementHistory: CanvasElementHistory) {
    const removals = (history.modifyData as RemovalData).removals
    if (removals) {
      removals.forEach((canvasElementId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === canvasElementId)
        if (foundElement) {
          store.dispatch(`canvas/${CanvasAction.HIDE_CANVAS_ELEMENT}`, foundElement)
        }
      })
      store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, canvasElementHistory)
    }
  }

  redoMove (history: CanvasElementHistory, canvasElements: CanvasElement[], canvasElementHistory: CanvasElementHistory) {
    const groups = (history.modifyData as MoveData).groups
    if (groups) {
      groups.forEach((groupId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === groupId)
        if (foundElement) {
          const data = history.modifyData as MoveData
          const prevPos = foundElement.position
          foundElement.position = {
            x: (data.to.x - data.from.x) + prevPos.x,
            y: (data.to.y - data.from.y) + prevPos.y
          }
        }
      })
      store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, canvasElementHistory)
    }
  }

  sortHistory (history: CanvasElementHistory[]) {
    return history.sort((a: CanvasElementHistory, b: CanvasElementHistory) => {
      return (a.timestampModified < b.timestampModified) ? -1 : (a.timestampModified > b.timestampModified ? 1 : 0)
    })
  }
  // eslint-disable-next-line
  [key: string]: any
}
