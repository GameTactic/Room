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
  TransformData,
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
        case Tracker.TRANSFORM:
          this.undoTransform(undo, canvasElements)
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
        case Tracker.TRANSFORM:
          this.redoTransform(redo, canvasElements)
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

  undoTransform (history: CanvasElementHistory, canvasElements: CanvasElement[]) {
    const groups = (history.modifyData as TransformData).groups
    if (groups) {
      groups.forEach((groupId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === groupId)
        if (foundElement) {
          const data = history.modifyData as TransformData
          const prev = foundElement.attrs
          foundElement.attrs = {
            position: {
              x: -1 * ((data.to.position.x - data.from.position.x) - prev.position.x),
              y: -1 * ((data.to.position.y - data.from.position.y) - prev.position.y)
            },
            rotation: -1 * ((data.to.rotation - data.from.rotation) - prev.rotation),
            skewX: -1 * ((data.to.skewX - data.from.skewX) - prev.skewX),
            skewY: -1 * ((data.to.skewY - data.from.skewY) - prev.skewY),
            scaleX: -1 * ((data.to.scaleX - data.from.scaleX) - prev.scaleX),
            scaleY: -1 * ((data.to.scaleY - data.from.scaleY) - prev.scaleY)
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

  redoTransform (history: CanvasElementHistory, canvasElements: CanvasElement[]) {
    const groups = (history.modifyData as TransformData).groups
    if (groups) {
      groups.forEach((groupId: string) => {
        const foundElement: CanvasElement | undefined = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === groupId)
        if (foundElement) {
          const data = history.modifyData as TransformData
          const prev = foundElement.attrs
          foundElement.attrs = {
            position: {
              x: (data.to.position.x - data.from.position.x) + prev.position.x,
              y: (data.to.position.y - data.from.position.y) + prev.position.y
            },
            rotation: (data.to.rotation - data.from.rotation) + prev.rotation,
            skewX: (data.to.skewX - data.from.skewX) + prev.skewX,
            skewY: (data.to.skewY - data.from.skewY) + prev.skewY,
            scaleX: (data.to.scaleX - data.from.scaleX) + prev.scaleX,
            scaleY: (data.to.scaleY - data.from.scaleY) + prev.scaleY
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
