import Vue from 'vue'
import Component from 'vue-class-component'
import { Socket } from 'vue-socket.io-extended'
import { Action, Getter } from 'vuex-class'
import { Prop } from 'vue-property-decorator'
import { AdditionData, CanvasElement, CanvasElementHistory, MoveData, RedoData, RemovalData, RemovalTools, RequestCanvasEntity, UndoData } from '@/types/Canvas'
import { Tool, Tracker } from '@/tools/Tool'
import { ToolGetters } from '@/store/modules/tools'
import { CanvasAction, CanvasGetters } from '@/store/modules/canvas'
import HandleRenderShapes from '@/util/HandleRenderShapes'
import HandleUndoRedo from '@/util/HandleUndoRedo'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'

@Component({
  name: 'CanvasSocket'
})
export default class CanvasSocket extends Vue {
  @Prop() id!: string
  @Getter(`tools/${ToolGetters.TOOLS}`) tools!: Tool[]
  @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS}`) canvasElements!: CanvasElement[]
  @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`) canvasElementsHistory!: CanvasElementHistory[]
  @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENT_BY_ID}`) canvasElementById!: (id: string) => CanvasElement | void
  @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENT_HISTORY_BY_ID}`) canvasElementHistoryById!: (id: string) => CanvasElementHistory | void
  @Getter(`tools/${ToolGetters.TOOL}`) findTool!: (name: string) => Tool | void
  @Action(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT}`) addCanvasElement!: (canvasElement: CanvasElement) => void
  @Action(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`) addCanvasElementHistory!: (canvasElementHistory: CanvasElementHistory) => void
  @Action(`canvas/${CanvasAction.SHOW_CANVAS_ELEMENT}`) showCanvasElement!: (canvasElement: CanvasElement) => void
  @Action(`canvas/${CanvasAction.HIDE_CANVAS_ELEMENT}`) hideCanvasElement!: (canvasElement: CanvasElement) => void

  // On Circle hook
  @Socket(SocketCanvasToolsEmit.CANVAS_TOOLS_CIRCLE)
  onCanvasToolsCircle (requests: RequestCanvasEntity[]) {
    requests.forEach((request: RequestCanvasEntity) => {
      this.onAddition(request)
    })
  }

  // On Entity hook
  @Socket(SocketCanvasToolsEmit.CANVAS_TOOLS_ENTITY)
  onCanvasToolsEntity (requests: RequestCanvasEntity[]) {
    requests.forEach((request: RequestCanvasEntity) => {
      this.onAddition(request)
    })
  }

  // On Erase hook
  @Socket(SocketCanvasToolsEmit.CANVAS_TOOLS_ERASE)
  onCanvasToolsErase (requests: RequestCanvasEntity[]) {
    requests.forEach((request: RequestCanvasEntity) => {
      this.onRemoval(request)
    })
  }

  // On FreeDraw hook
  @Socket(SocketCanvasToolsEmit.CANVAS_TOOLS_FREE_DRAW)
  onCanvasToolsFreeDraw (requests: RequestCanvasEntity[]) {
    requests.forEach((request: RequestCanvasEntity) => {
      this.onAddition(request)
    })
  }

  // On Line hook
  @Socket(SocketCanvasToolsEmit.CANVAS_TOOLS_LINE)
  onCanvasToolsLine (requests: RequestCanvasEntity[]) {
    requests.forEach((request: RequestCanvasEntity) => {
      this.onAddition(request)
    })
  }

  // On Move hook
  @Socket(SocketCanvasToolsEmit.CANVAS_TOOLS_MOVE)
  onCanvasToolsMove (requests: RequestCanvasEntity[]) {
    requests.forEach((request: RequestCanvasEntity) => {
      this.moveToState(request)
    })
  }

  // On Ping hook
  @Socket(SocketCanvasToolsEmit.CANVAS_TOOLS_PING)
  onCanvasToolsPing (requests: RequestCanvasEntity[]) {
    requests.forEach((request: RequestCanvasEntity) => {
      this.onAddition(request)
    })
  }

  // On Ruler hook
  @Socket(SocketCanvasToolsEmit.CANVAS_TOOLS_RULER)
  onCanvasToolsRuler (requests: RequestCanvasEntity[]) {
    requests.forEach((request: RequestCanvasEntity) => {
      this.onAddition(request)
    })
  }

  // On Text hook
  @Socket(SocketCanvasToolsEmit.CANVAS_TOOLS_TEXT)
  onCanvasToolsText (requests: RequestCanvasEntity[]) {
    requests.forEach((request: RequestCanvasEntity) => {
      this.onRemoval(request)
    })
  }

  // On Undo hook
  @Socket(SocketCanvasToolsEmit.CANVAS_TOOLS_UNDO)
  onCanvasToolsUndo (requests: RequestCanvasEntity[]) {
    requests.forEach((request: RequestCanvasEntity) => {
      this.undoToState(request)
    })
  }

  // On Redo hook
  @Socket(SocketCanvasToolsEmit.CANVAS_TOOLS_REDO)
  onCanvasToolsRedo (requests: RequestCanvasEntity[]) {
    requests.forEach((request: RequestCanvasEntity) => {
      this.redoToState(request)
    })
  }

  onAddition (request: RequestCanvasEntity) {
    const additionData = request.modifyData as AdditionData
    if (request.canvasElements && additionData.tool) {
      const foundTool: Tool | void = this.findTool(additionData.tool)
      if (foundTool && foundTool.renderCanvas) {
        foundTool.renderCanvas(request)
        this.additionToState(request)
      }
    }
  }

  onRemoval (request: RequestCanvasEntity) {
    const removalData = request.modifyData as RemovalData
    if (removalData.removals) {
      const foundTool: Tool | void = this.findTool(RemovalTools.ERASER)
      if (foundTool && foundTool.renderCanvas) {
        foundTool.renderCanvas(request)
        this.removalToState(request)
      }
    }
  }

  additionToState (request: RequestCanvasEntity) {
    const additionsData = request.modifyData as AdditionData
    if (request.canvasElements.length === additionsData.additions.length && request.canvasElements) {
      request.canvasElements.forEach((canvasElement: CanvasElement) => {
        this.addCanvasElement(canvasElement)
      })
      delete request.canvasElements
      this.addCanvasElementHistory(request)
    }
    new HandleRenderShapes(this.$store).handle()
  }

  removalToState (request: RequestCanvasEntity) {
    const removalsData = request.modifyData as RemovalData
    if (removalsData.removals) {
      removalsData.removals.forEach((groupId: string) => {
        const foundElement: CanvasElement | void = this.canvasElementById(groupId)
        if (foundElement) {
          this.hideCanvasElement(foundElement)
        }
      })
      delete request.canvasElements
      this.addCanvasElementHistory(request)
    }
    new HandleRenderShapes(this.$store).handle()
  }

  moveToState (request: RequestCanvasEntity) {
    const moveData = request.modifyData as MoveData
    if (moveData.to && moveData.from && moveData.groups) {
      moveData.groups.forEach((groupId: string) => {
        const foundElement: CanvasElement | void = this.canvasElementById(groupId)
        if (foundElement) {
          foundElement.position = {
            x: (moveData.to.x - moveData.from.x) + foundElement.position.x,
            y: (moveData.to.y - moveData.from.y) + foundElement.position.y
          }
        }
      })
      delete request.canvasElements
      this.addCanvasElementHistory(request)
    }
    new HandleRenderShapes(this.$store).handle()
  }

  undoToState (request: RequestCanvasEntity) {
    const undoData = request.modifyData as UndoData
    if (undoData.historyId) {
      const undo: CanvasElementHistory | void = this.canvasElementHistoryById(undoData.historyId)
      if (undo) {
        const handleUndoRedo = new HandleUndoRedo()
        switch (undo.modifyType) {
          case Tracker.ADDITION:
            handleUndoRedo.undoAdditions(undo, this.canvasElements)
            break
          case Tracker.REMOVAL:
            handleUndoRedo.undoRemovals(undo, this.canvasElements)
            break
          case Tracker.MOVE:
            handleUndoRedo.undoMove(undo, this.canvasElements)
            break
        }
        delete request.canvasElements
        this.addCanvasElementHistory(request)
      }
    }
    new HandleRenderShapes(this.$store).handle()
  }

  redoToState (request: RequestCanvasEntity) {
    const redoData = request.modifyData as RedoData
    if (redoData.historyId) {
      const undoObject: CanvasElementHistory | void = this.canvasElementHistoryById(redoData.historyId)
      if (undoObject) {
        const undoModifyData = undoObject.modifyData as UndoData
        if (undoModifyData) {
          const redo: CanvasElementHistory | void = this.canvasElementHistoryById(undoModifyData.historyId)
          if (redo) {
            const handleUndoRedo = new HandleUndoRedo()
            switch (redo.modifyType) {
              case Tracker.ADDITION:
                handleUndoRedo.redoAdditions(redo, this.canvasElements)
                break
              case Tracker.REMOVAL:
                handleUndoRedo.redoRemovals(redo, this.canvasElements)
                break
              case Tracker.MOVE:
                handleUndoRedo.redoMove(redo, this.canvasElements)
                break
            }
            delete request.canvasElements
            this.addCanvasElementHistory(request)
          }
        }
      }
    }
    new HandleRenderShapes(this.$store).handle()
  }
}
