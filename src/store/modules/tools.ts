import MoveCanvas from '@/tools/util/MoveCanvas'
import { ActionContext, Module } from 'vuex'
import { ToolInterface } from '@/tools/Tool'
import Ping from '@/tools/Ping'
import FreeDraw from '@/tools/FreeDraw'
import Erase from '@/tools/Erase'
import Circle from '@/tools/Circle'
import Line from '@/tools/Line'
import Ruler from '@/tools/Ruler'
import Text from '@/tools/Text'
import Move from '@/tools/Move'
import Konva from 'konva'

export enum ToolGetters {
  ENABLED_TOOL = 'enabledTool',
  TOOLS = 'tools',
  TOOL = 'tool',
  ENABLED = 'enabled'
}

export enum ToolsAction {
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

export interface ToolState {
  enabledTool?: ToolInterface;
  enabled: boolean;
  tools: ToolInterface[];
}

export enum ToolsMutation {
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

type ToolActionContext = ActionContext<ToolState, {}>;

const ToolModule: Module<ToolState, {}> = {
  namespaced: true,
  state () {
    return {
      enabledTool: undefined,
      enabled: false,
      tools: [
        new Ping('ping', 5, '#005555FF', true),
        new FreeDraw('freeDraw', 5, '#CE0000FF', false),
        new Erase('erase', [], false),
        new Line('line', 5, '#CE0000FF', 'line', 0, false),
        new Circle('circle', 5, '#CE000080', false, true, '#CE0000FF', 0),
        new Ruler('ruler', 3, '#C2C4BD80', false, true),
        new Text('text', 5, '#CE0000FF', false, ''),
        new Move('move', new Konva.Group(), false),
        new MoveCanvas('moveCanvas')
      ]
    }
  },
  getters: {
    [ToolGetters.TOOLS]: state => state.tools,
    [ToolGetters.ENABLED_TOOL]: state => state.enabledTool,
    [ToolGetters.TOOL]: (state) => (name: string) => state.tools.find(tool => tool.name === name),
    [ToolGetters.ENABLED]: state => state.enabled
  },
  mutations: {
    [ToolsMutation.SET_ENABLED_TOOL] (state: ToolState, payload: string) {
      state.enabledTool = state.tools.find(tool => tool.name === payload)
    },
    [ToolsMutation.SET_DISABLED_TOOL] (state: ToolState) {
      state.enabledTool = undefined
    },
    [ToolsMutation.SET_ENABLED] (state: ToolState) {
      state.enabled = true
    },
    [ToolsMutation.SET_DISABLED] (state: ToolState) {
      state.enabled = false
    },
    [ToolsMutation.SET_TOOL] (state: ToolState, payload: ToolInterface) {
      let foundIndex = -1
      const found = state.tools.find((tool: ToolInterface, index: number) => {
        foundIndex = index
        return tool.name === payload.name
      })

      if (found) {
        state.tools.splice(foundIndex, 1, { ...found, ...payload })
      }
      state.enabledTool = payload
    },
    [ToolsMutation.SET_COLOUR] (state: ToolState, colour: string) {
      if (state.enabledTool) {
        state.enabledTool.colour = colour
      }
    },
    [ToolsMutation.SET_SIZE] (state: ToolState, size: number) {
      if (state.enabledTool) {
        state.enabledTool.size = size
      }
    },
    [ToolsMutation.SET_END_STYLE] (state: ToolState, endStyle: string) {
      if (state.enabledTool) {
        state.enabledTool.endStyle = endStyle
      }
    },
    [ToolsMutation.SET_OUTLINE_COLOUR] (state: ToolState, outlineColour: string) {
      if (state.enabledTool) {
        state.enabledTool.outlineColour = outlineColour
      }
    },
    [ToolsMutation.SET_SHOW_RADIUS] (state: ToolState, showRadius: boolean) {
      if (state.enabledTool) {
        state.enabledTool.showRadius = showRadius
      }
    },
    [ToolsMutation.SET_SHOW_CIRCLE] (state: ToolState, showCircle: boolean) {
      if (state.enabledTool) {
        state.enabledTool.showCircle = showCircle
      }
    },
    [ToolsMutation.SET_TEMPORARY] (state: ToolState, temporary: boolean) {
      if (state.enabledTool) {
        state.enabledTool.temporary = temporary
      }
    },
    [ToolsMutation.SET_STROKE_STYLE] (state: ToolState, strokeStyle: number) {
      if (state.enabledTool) {
        state.enabledTool.strokeStyle = strokeStyle
      }
    }
  },
  actions: {
    [ToolsAction.ENABLE_TOOL] (context: ToolActionContext, toolName: string) {
      context.commit(ToolsMutation.SET_ENABLED_TOOL, toolName)
    },
    [ToolsAction.DISABLE_TOOL] (context: ToolActionContext) {
      context.commit(ToolsMutation.SET_DISABLED_TOOL)
    },
    [ToolsAction.ENABLE] (context: ToolActionContext) {
      context.commit(ToolsMutation.SET_ENABLED)
    },
    [ToolsAction.DISABLE] (context: ToolActionContext) {
      context.commit(ToolsMutation.SET_DISABLED)
    },
    [ToolsAction.SET_TOOL] (context: ToolActionContext, tool: ToolInterface) {
      context.commit(ToolsMutation.SET_TOOL, tool)
    },
    [ToolsAction.SET_COLOUR] (context: ToolActionContext, colour: string) {
      context.commit(ToolsMutation.SET_COLOUR, colour)
    },
    [ToolsAction.SET_SIZE] (context: ToolActionContext, size: number) {
      context.commit(ToolsMutation.SET_SIZE, size)
    },
    [ToolsAction.SET_END_STYLE] (context: ToolActionContext, endStyle: string) {
      context.commit(ToolsMutation.SET_END_STYLE, endStyle)
    },
    [ToolsAction.SET_OUTLINE_COLOUR] (context: ToolActionContext, outlineColour: string) {
      context.commit(ToolsMutation.SET_OUTLINE_COLOUR, outlineColour)
    },
    [ToolsAction.SET_SHOW_RADIUS] (context: ToolActionContext, showRadius: boolean) {
      context.commit(ToolsMutation.SET_SHOW_RADIUS, showRadius)
    },
    [ToolsAction.SET_SHOW_CIRCLE] (context: ToolActionContext, showCircle: boolean) {
      context.commit(ToolsMutation.SET_SHOW_CIRCLE, showCircle)
    },
    [ToolsAction.SET_TEMPORARY] (context: ToolActionContext, temporarily: boolean) {
      context.commit(ToolsMutation.SET_TEMPORARY, temporarily)
    },
    [ToolsAction.SET_STROKE_STYLE] (context: ToolActionContext, strokeStyle: number) {
      context.commit(ToolsMutation.SET_STROKE_STYLE, strokeStyle)
    }
  }
}

export default ToolModule
