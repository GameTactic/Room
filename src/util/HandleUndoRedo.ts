import { Tracker } from '@/tools/Tool'
import { SocketCanvasAction, SocketCanvasGetters } from '@/store/modules/socket/canvas'
import store from '@/main'
import { ISO } from '@/util/ISO'
import uuid from 'uuid'
import { AppAuthenticationGetters, JWT } from '@/store/modules/app/authentication'
import { SocketActions, SocketCanvasToolsEmit } from '@/store/modules/socket'
import {
  AdditionData,
  CanvasElement,
  CanvasElementHistory,
  MoveData,
  RedoData,
  RemovalData,
  UndoData
} from '@/types/Canvas'
import { Namespaces } from '@/store'

export default class HandleUndoRedo {
  handleUndoRedo = (undoRedoString: string): void => {
    const canvasElementsHistory: CanvasElementHistory[] | void = (store.getters[`${Namespaces.SOCKET_CANVAS}/${SocketCanvasGetters.CANVAS_ELEMENTS_HISTORY}`])
    if (canvasElementsHistory) {
      const foundElement: CanvasElementHistory = this['find' + undoRedoString](this.sortHistory([...canvasElementsHistory]))
      if (foundElement) {
        if (undoRedoString === 'Undo') {
          this.undo(Tracker.UNDO, { historyId: foundElement.id })
        } else if (undoRedoString === 'Redo') {
          this.redo(Tracker.REDO, foundElement)
        }
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

  undo (modifyType: Tracker, modifyData: UndoData) {
    const data: CanvasElementHistory = {
      id: uuid(),
      jti: (store.getters[`${Namespaces.APP_AUTHENTICATION}/${AppAuthenticationGetters.JWT}`]).jti,
      modifyType: modifyType,
      modifyData: modifyData,
      timestampModified: ISO.timestamp()
    }
    const canvasElements = store.getters[`${Namespaces.SOCKET_CANVAS}/${SocketCanvasGetters.CANVAS_ELEMENTS}`]
    const canvasElementHistory = store.getters[`${Namespaces.SOCKET_CANVAS}/${SocketCanvasGetters.CANVAS_ELEMENTS_HISTORY}`]
    const undo: CanvasElementHistory = canvasElementHistory.find((history: CanvasElementHistory) => history.id === modifyData.historyId)
    if (undo) {
      switch (undo.modifyType) {
        case Tracker.ADDITION:
          this.undoAdditions(undo, canvasElements)
          break
        case Tracker.REMOVAL:
          this.undoRemovals(undo, canvasElements)
          break
        case Tracker.MOVE:
          this.undoMove(undo, canvasElements)
          break
      }
      store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, data)
      this.sendToSocket(data, SocketCanvasToolsEmit.CANVAS_TOOLS_UNDO)
    }
  }

  redo (modifyType: Tracker, history: CanvasElementHistory) {
    const data: CanvasElementHistory = {
      id: uuid(),
      jti: (store.getters[`${Namespaces.APP_AUTHENTICATION}/${AppAuthenticationGetters.JWT}`]).jti,
      modifyType: modifyType,
      modifyData: { historyId: history.id },
      timestampModified: ISO.timestamp()
    }
    const canvasElements = store.getters[`${Namespaces.SOCKET_CANVAS}/${SocketCanvasGetters.CANVAS_ELEMENTS}`]
    const canvasElementHistory = store.getters[`${Namespaces.SOCKET_CANVAS}/${SocketCanvasGetters.CANVAS_ELEMENTS_HISTORY}`]
    const modifier = history.modifyData as UndoData
    const redo: CanvasElementHistory = canvasElementHistory.find((history: CanvasElementHistory) => history.id === modifier.historyId)
    if (redo) {
      switch (redo.modifyType) {
        case Tracker.ADDITION:
          this.redoAdditions(redo, canvasElements)
          break
        case Tracker.REMOVAL:
          this.redoRemovals(redo, canvasElements)
          break
        case Tracker.MOVE:
          this.redoMove(redo, canvasElements)
          break
      }
      store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, data)
      this.sendToSocket(data, SocketCanvasToolsEmit.CANVAS_TOOLS_REDO)
    }
  }

  undoAdditions (history: CanvasElementHistory, canvasElements: CanvasElement[]) {
    const additions = (history.modifyData as AdditionData).additions
    if (additions) {
      additions.forEach((canvasElementId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === canvasElementId)
        if (foundElement) {
          store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.HIDE_CANVAS_ELEMENT}`, foundElement)
        }
      })
    }
  }

  undoRemovals (history: CanvasElementHistory, canvasElements: CanvasElement[]) {
    const removals = (history.modifyData as RemovalData).removals
    if (removals) {
      removals.forEach((canvasElementId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === canvasElementId)
        if (foundElement) {
          store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.SHOW_CANVAS_ELEMENT}`, foundElement)
        }
      })
    }
  }

  undoMove (history: CanvasElementHistory, canvasElements: CanvasElement[]) {
    const groups = (history.modifyData as MoveData).groups
    if (groups) {
      groups.forEach((groupId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === groupId)
        if (foundElement) {
          const data = history.modifyData as MoveData
          const prevPos = foundElement.position
          foundElement.position = {
            x: -1 * ((data.to.x - data.from.x) - prevPos.x),
            y: -1 * ((data.to.y - data.from.y) - prevPos.y)
          }
        }
      })
    }
  }

  redoAdditions (history: CanvasElementHistory, canvasElements: CanvasElement[]) {
    const additions = (history.modifyData as AdditionData).additions
    if (additions) {
      additions.forEach((canvasElementId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === canvasElementId)
        if (foundElement) {
          store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.SHOW_CANVAS_ELEMENT}`, foundElement)
        }
      })
    }
  }

  redoRemovals (history: CanvasElementHistory, canvasElements: CanvasElement[]) {
    const removals = (history.modifyData as RemovalData).removals
    if (removals) {
      removals.forEach((canvasElementId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === canvasElementId)
        if (foundElement) {
          store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.HIDE_CANVAS_ELEMENT}`, foundElement)
        }
      })
    }
  }

  redoMove (history: CanvasElementHistory, canvasElements: CanvasElement[]) {
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
    }
  }

  sortHistory (history: CanvasElementHistory[]) {
    const jwt = store.getters[`${Namespaces.APP_AUTHENTICATION}/${AppAuthenticationGetters.JWT}`] as JWT
    const filtered = history.filter((canvasElementHistory: CanvasElementHistory) => canvasElementHistory.jti === jwt.jti)
    return filtered.sort((a: CanvasElementHistory, b: CanvasElementHistory) => {
      return (a.timestampModified < b.timestampModified) ? -1 : (a.timestampModified > b.timestampModified ? 1 : 0)
    })
  }

  sendToSocket (history: CanvasElementHistory, emit: string) {
    store.dispatch(`${Namespaces.SOCKET}/${SocketActions.EMIT}`, { data: { ...history, canvasElements: [] }, emit: emit })
  }
  // eslint-disable-next-line
  [key: string]: any
}
