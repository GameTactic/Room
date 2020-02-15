import { ActionContext, Module } from 'vuex'
import { Tool } from '@/tools/Tool'
import Ping from '@/tools/Ping'
import FreeDraw from '@/tools/FreeDraw'
import Erase from '@/tools/Erase'

export enum ToolGetters {
  ACTIVE_TOOL = 'activeTool',
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
  SET_SIZE = 'setSize'
}

export interface ToolState {
  activeTool?: Tool;
  enabledTool: string;
  enabled: boolean;
  tools: Tool[];
}

export enum ToolsMutation {
  SET_ENABLED_TOOL = 'SET_ENABLED_TOOL',
  SET_DISABLED_TOOL = 'SET_DISABLED_TOOL',
  SET_ENABLED = 'SET_ENABLED',
  SET_DISABLED = 'SET_DISABLED',
  SET_TOOL = 'SET_TOOL',
  SET_COLOUR = 'SET_COLOUR',
  SET_SIZE = ' SET_SIZE'
}

type ToolActionContext = ActionContext<ToolState, {}>;

const ToolModule: Module<ToolState, {}> = {
  namespaced: true,
  state () {
    return {
      activeTool: undefined,
      enabledTool: '',
      enabled: true,
      tools: [
        new Ping('ping', 5, '#005555'),
        new FreeDraw('freedraw', 2, '#FF0000'),
        new Erase('erase', 2, '#FFFFFF')
      ]
    }
  },
  getters: {
    [ToolGetters.TOOLS]: state => state.tools,
    [ToolGetters.ACTIVE_TOOL]: state => state.activeTool,
    [ToolGetters.TOOL]: (state) => (name: string) => state.tools.find(tool => tool.name === name),
    [ToolGetters.ENABLED]: state => state.enabled
  },
  mutations: {
    [ToolsMutation.SET_ENABLED_TOOL] (state: ToolState, payload: string) {
      state.enabledTool = payload
      state.activeTool = state.tools.find(tool => tool.name === payload)
    },
    [ToolsMutation.SET_DISABLED_TOOL] (state: ToolState) {
      state.enabledTool = ''
      state.activeTool = undefined
    },
    [ToolsMutation.SET_ENABLED] (state: ToolState) {
      state.enabled = true
    },
    [ToolsMutation.SET_DISABLED] (state: ToolState) {
      state.enabled = false
    },
    [ToolsMutation.SET_TOOL] (state: ToolState, payload: Tool) {
      const found = state.tools.find((tool: Tool) => {
        return tool.name === payload.name
      })
      if (found) {
        state.activeTool = payload
      }
    },
    [ToolsMutation.SET_COLOUR] (state: ToolState, colour: string) {
      if (state.activeTool) {
        state.activeTool.colour = colour
      }
    },
    [ToolsMutation.SET_SIZE] (state: ToolState, size: number) {
      if (state.activeTool) {
        state.activeTool.size = size
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
    [ToolsAction.SET_TOOL] (context: ToolActionContext, tool: Tool) {
      context.commit(ToolsMutation.SET_TOOL, tool)
    },
    [ToolsAction.SET_COLOUR] (context: ToolActionContext, colour: string) {
      context.commit(ToolsMutation.SET_COLOUR, colour)
    },
    [ToolsAction.SET_SIZE] (context: ToolActionContext, size: number) {
      context.commit(ToolsMutation.SET_SIZE, size)
    }
  }
}

export default ToolModule
