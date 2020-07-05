import MoveCanvas from '@/tools/util/moveCanvas'
import { ActionContext, Module } from 'vuex'
import { Tool } from '@/tools/tool'
import Ping from '@/tools/ping'
import FreeDraw from '@/tools/freeDraw'
import Erase from '@/tools/erase'
import Circle from '@/tools/circle'
import Line, { LineType } from '@/tools/line'
import Ruler from '@/tools/ruler'
import Text from '@/tools/text'
import Move from '@/tools/move'
import Entity from '@/tools/entity'
import { RootState } from '@/store/types'

export enum AppToolGetters {
  ENABLED_TOOL = 'enabledTool',
  TOOLS = 'tools',
  TOOL = 'tool',
  ENABLED = 'enabled'
}

export enum AppToolsAction {
  ENABLE_TOOL = 'enableTool',
  DISABLE_TOOL = 'disableTool',
  ENABLE = 'enable',
  DISABLE = 'disable',
  SET_TOOL = 'setTool',
  SET_COLOUR = 'setColour',
  SET_SIZE = 'setSize',
  SET_END_STYLE = 'setEndStyle',
  SET_SHOW_RADIUS = 'setShowRadius',
  SET_SHOW_CIRCLE = 'setShowCircle',
  SET_OUTLINE_COLOUR = 'setOutlineColour',
  SET_TEMPORARY = 'setTemporary',
  SET_STROKE_STYLE = 'setStrokeStyle'
}

export interface AppToolState {
  enabledTool?: Tool;
  enabled: boolean;
  tools: Tool[];
}

export enum AppToolsMutation {
  SET_ENABLED_TOOL = 'SET_ENABLED_TOOL',
  SET_DISABLED_TOOL = 'SET_DISABLED_TOOL',
  SET_ENABLED = 'SET_ENABLED',
  SET_DISABLED = 'SET_DISABLED',
  SET_TOOL = 'SET_TOOL',
  SET_COLOUR = 'SET_COLOUR',
  SET_SIZE = 'SET_SIZE',
  SET_END_STYLE = 'SET_END_STYLE',
  SET_SHOW_RADIUS = 'SET_SHOW_RADIUS',
  SET_SHOW_CIRCLE = 'SET_SHOW_CIRCLE',
  SET_OUTLINE_COLOUR = 'SET_OUTLINE_COLOUR',
  SET_TEMPORARY = 'SET_TEMPORARY',
  SET_STROKE_STYLE = 'SET_STROKE_STYLE'
}

type AppToolActionContext = ActionContext<AppToolState, RootState>;

const AppToolModule: Module<AppToolState, RootState> = {
  namespaced: true,
  state () {
    return {
      enabledTool: undefined,
      enabled: false,
      tools: [
        new Ping('ping', 5, '#005555FF', true),
        new FreeDraw('freeDraw', 5, '#CE0000FF', false),
        new Erase('erase', false),
        new Line('line', 5, '#CE0000FF', LineType.LINE, 0, false),
        new Circle('circle', 5, '#CE000080', false, true, '#CE0000FF', 0),
        new Ruler('ruler', 3, '#C2C4BD80', false, true),
        new Text('text', 5, '#CE0000FF', false, ''),
        new Move('move', false),
        new MoveCanvas('moveCanvas', false),
        new Entity('entity', false)
      ]
    }
  },
  getters: {
    [AppToolGetters.TOOLS]: (state): Tool[] => state.tools,
    [AppToolGetters.ENABLED_TOOL]: (state): Tool | undefined => state.enabledTool,
    [AppToolGetters.TOOL]: (state) => (name: string): Tool | undefined => state.tools.find(tool => tool.name === name),
    [AppToolGetters.ENABLED]: (state): boolean => state.enabled
  },
  mutations: {
    [AppToolsMutation.SET_ENABLED_TOOL] (state: AppToolState, payload: string) {
      state.enabledTool = state.tools.find(tool => tool.name === payload)
    },
    [AppToolsMutation.SET_DISABLED_TOOL] (state: AppToolState) {
      state.enabledTool = undefined
    },
    [AppToolsMutation.SET_ENABLED] (state: AppToolState) {
      state.enabled = true
    },
    [AppToolsMutation.SET_DISABLED] (state: AppToolState) {
      state.enabled = false
    },
    [AppToolsMutation.SET_TOOL] (state: AppToolState, payload: Tool) {
      let foundIndex = -1
      const found = state.tools.find((tool: Tool, index: number) => {
        foundIndex = index
        return tool.name === payload.name
      })

      if (found) {
        state.tools.splice(foundIndex, 1, { ...found, ...payload })
      }
      state.enabledTool = payload
    },
    [AppToolsMutation.SET_COLOUR] (state: AppToolState, colour: string) {
      if (state.enabledTool) {
        state.enabledTool.colour = colour
      }
    },
    [AppToolsMutation.SET_SIZE] (state: AppToolState, size: number) {
      if (state.enabledTool) {
        state.enabledTool.size = size
      }
    },
    [AppToolsMutation.SET_END_STYLE] (state: AppToolState, endStyle: string) {
      if (state.enabledTool) {
        state.enabledTool.endStyle = endStyle
      }
    },
    [AppToolsMutation.SET_OUTLINE_COLOUR] (state: AppToolState, outlineColour: string) {
      if (state.enabledTool) {
        state.enabledTool.outlineColour = outlineColour
      }
    },
    [AppToolsMutation.SET_SHOW_RADIUS] (state: AppToolState, showRadius: boolean) {
      if (state.enabledTool) {
        state.enabledTool.showRadius = showRadius
      }
    },
    [AppToolsMutation.SET_SHOW_CIRCLE] (state: AppToolState, showCircle: boolean) {
      if (state.enabledTool) {
        state.enabledTool.showCircle = showCircle
      }
    },
    [AppToolsMutation.SET_TEMPORARY] (state: AppToolState, temporary: boolean) {
      if (state.enabledTool) {
        state.enabledTool.temporary = temporary
      }
    },
    [AppToolsMutation.SET_STROKE_STYLE] (state: AppToolState, strokeStyle: number) {
      if (state.enabledTool) {
        state.enabledTool.strokeStyle = strokeStyle
      }
    }
  },
  actions: {
    [AppToolsAction.ENABLE_TOOL] (context: AppToolActionContext, toolName: string) {
      context.commit(AppToolsMutation.SET_ENABLED_TOOL, toolName)
    },
    [AppToolsAction.DISABLE_TOOL] (context: AppToolActionContext) {
      context.commit(AppToolsMutation.SET_DISABLED_TOOL)
    },
    [AppToolsAction.ENABLE] (context: AppToolActionContext) {
      context.commit(AppToolsMutation.SET_ENABLED)
    },
    [AppToolsAction.DISABLE] (context: AppToolActionContext) {
      context.commit(AppToolsMutation.SET_DISABLED)
    },
    [AppToolsAction.SET_TOOL] (context: AppToolActionContext, tool: Tool) {
      context.commit(AppToolsMutation.SET_TOOL, tool)
    },
    [AppToolsAction.SET_COLOUR] (context: AppToolActionContext, colour: string) {
      context.commit(AppToolsMutation.SET_COLOUR, colour)
    },
    [AppToolsAction.SET_SIZE] (context: AppToolActionContext, size: number) {
      context.commit(AppToolsMutation.SET_SIZE, size)
    },
    [AppToolsAction.SET_END_STYLE] (context: AppToolActionContext, endStyle: string) {
      context.commit(AppToolsMutation.SET_END_STYLE, endStyle)
    },
    [AppToolsAction.SET_OUTLINE_COLOUR] (context: AppToolActionContext, outlineColour: string) {
      context.commit(AppToolsMutation.SET_OUTLINE_COLOUR, outlineColour)
    },
    [AppToolsAction.SET_SHOW_RADIUS] (context: AppToolActionContext, showRadius: boolean) {
      context.commit(AppToolsMutation.SET_SHOW_RADIUS, showRadius)
    },
    [AppToolsAction.SET_SHOW_CIRCLE] (context: AppToolActionContext, showCircle: boolean) {
      context.commit(AppToolsMutation.SET_SHOW_CIRCLE, showCircle)
    },
    [AppToolsAction.SET_TEMPORARY] (context: AppToolActionContext, temporarily: boolean) {
      context.commit(AppToolsMutation.SET_TEMPORARY, temporarily)
    },
    [AppToolsAction.SET_STROKE_STYLE] (context: AppToolActionContext, strokeStyle: number) {
      context.commit(AppToolsMutation.SET_STROKE_STYLE, strokeStyle)
    }
  }
}

export default AppToolModule
