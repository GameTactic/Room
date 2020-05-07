import Vue from 'vue'
import Component from 'vue-class-component'
import { Socket } from 'vue-socket.io-extended'
import { Getter } from 'vuex-class'
import { Prop } from 'vue-property-decorator'
import { AdditionData, CanvasElement, CanvasElementHistory, MoveData, RedoData, RemovalData, RemovalTools, RequestCanvasEntity, UndoData } from '@/types/Canvas'
import { Tool, Tracker } from '@/tools/Tool'
import { ToolGetters } from '@/store/modules/tools'
import store from '@/main'
import { CanvasAction, CanvasGetters } from '@/store/modules/canvas'
import HandleRenderShapes from '@/util/HandleRenderShapes'
import HandleUndoRedo from '@/util/HandleUndoRedo'

@Component({
  name: 'CanvasSocket'
})
export default class CanvasSocket extends Vue {
  @Prop() id!: string
  @Getter(`tools/${ToolGetters.TOOLS}`) tools!: Tool[]
  @Socket('canvasRequestCanvasEntity')
  onRequestCanvasEntity (request: RequestCanvasEntity[]) {
    request.forEach((data: RequestCanvasEntity) => {
      if (data.modifyType && data.jti && data.timestampModified && data.id && data.canvasElements && data.modifyData) {
        switch (data.modifyType) {
          case Tracker.ADDITION:
            const additionData = data.modifyData as AdditionData
            if (data.canvasElements && additionData.tool) {
              const foundTool = this.tools.find((tool: Tool) => tool.name === additionData.tool)
              if (foundTool && foundTool.renderCanvas) {
                foundTool.renderCanvas(data)
                this.addToState(data)
              }
            }
            break
          case Tracker.REMOVAL:
            const removalData = data.modifyData as RemovalData
            if (removalData.removals) {
              const foundTool = this.tools.find((tool: Tool) => tool.name === RemovalTools.ERASER)
              if (foundTool && foundTool.renderCanvas) {
                foundTool.renderCanvas(data)
                this.addToState(data)
              }
            }
            break
          case Tracker.MOVE:
            this.addToState(data)
            break
          case Tracker.UNDO:
            this.addToState(data)
            break
          case Tracker.REDO:
            this.addToState(data)
            break
        }
      }
    })
    const renderShapes = new HandleRenderShapes(this.$store)
    renderShapes.handle()
  }

  addToState = (request: RequestCanvasEntity): void => {
    switch (request.modifyType) {
      case Tracker.ADDITION:
        const additionsData = request.modifyData as AdditionData
        if (request.canvasElements.length === additionsData.additions.length && request.canvasElements.length > 0) {
          request.canvasElements.forEach((canvasElement: CanvasElement) => {
            store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT}`, canvasElement)
          })
          delete request.canvasElements
          store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, request)
        }
        break
      case Tracker.REMOVAL:
        const removalsData = request.modifyData as RemovalData
        if (removalsData.removals && removalsData.removals.length > 0) {
          const canvasElements = store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`]
          if (canvasElements) {
            removalsData.removals.forEach((groupId: string) => {
              const foundElement: CanvasElement = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === groupId)
              if (foundElement) {
                store.dispatch(`canvas/${CanvasAction.HIDE_CANVAS_ELEMENT}`, foundElement)
              }
            })
            delete request.canvasElements
            store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, request)
          }
        }
        break
      case Tracker.MOVE:
        const moveData = request.modifyData as MoveData
        if (moveData.to && moveData.from && moveData.groups.length > 0) {
          const canvasElements = store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`]
          if (canvasElements) {
            moveData.groups.forEach((groupId: string) => {
              const foundElement: CanvasElement = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === groupId)
              if (foundElement) {
                foundElement.position = {
                  x: (moveData.to.x - moveData.from.x) + foundElement.position.x,
                  y: (moveData.to.y - moveData.from.y) + foundElement.position.y
                }
              }
            })
            delete request.canvasElements
            store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, request)
          }
        }
        break
      case Tracker.UNDO:
        const undoData = request.modifyData as UndoData
        if (undoData.historyId) {
          const undo: CanvasElementHistory | undefined = store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`].find((history: CanvasElementHistory) => history.id === undoData.historyId)
          if (undo) {
            const handleUndoRedo = new HandleUndoRedo()
            switch (undo.modifyType) {
              case Tracker.ADDITION:
                delete request.canvasElements
                handleUndoRedo.undoAdditions(undo, store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`])
                store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, request as CanvasElementHistory)
                break
              case Tracker.REMOVAL:
                delete request.canvasElements
                handleUndoRedo.undoRemovals(undo, store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`])
                store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, request as CanvasElementHistory)
                break
              case Tracker.MOVE:
                delete request.canvasElements
                handleUndoRedo.undoMove(undo, store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`])
                store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, request as CanvasElementHistory)
                break
            }
          }
        }
        break
      case Tracker.REDO:
        const redoData = request.modifyData as RedoData
        if (redoData.historyId) {
          const undoObject: CanvasElementHistory | undefined = store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`].find((history: CanvasElementHistory) => history.id === redoData.historyId)
          const undoModifyData = undoObject?.modifyData as UndoData
          if (undoObject && undoModifyData) {
            const redo: CanvasElementHistory | undefined = store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`].find((history: CanvasElementHistory) => history.id === undoModifyData.historyId)
            if (redo) {
              const handleUndoRedo = new HandleUndoRedo()
              switch (redo.modifyType) {
                case Tracker.ADDITION:
                  delete request.canvasElements
                  handleUndoRedo.redoAdditions(redo, store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`])
                  store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, request as CanvasElementHistory)
                  break
                case Tracker.REMOVAL:
                  delete request.canvasElements
                  handleUndoRedo.redoRemovals(redo, store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`])
                  store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, request as CanvasElementHistory)
                  break
                case Tracker.MOVE:
                  delete request.canvasElements
                  handleUndoRedo.redoMove(redo, store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`])
                  store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, request as CanvasElementHistory)
                  break
              }
            }
          }
        }
        break
    }
  }
}
