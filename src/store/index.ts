import Vue from 'vue'
import Vuex from 'vuex'
import { ITool } from '../types/canvas'

Vue.use(Vuex)

interface IVuexState {
  x: number;
  y: number;
  enabledTool: string;
  enabled: boolean;
  tools: ITool[]
}

export default new Vuex.Store<IVuexState>({
  state: {
    x: 0,
    y: 0,
    enabledTool: '',
    enabled: false,
    tools: [
      { name: 'ping', colour: '#005555', size: 5 },
      { name: 'freedraw', colour: '#FF0000', size: 2 }
    ]
  },
  getters: {
    tools: state => state.tools,
    tool: state => (name: string, property: string = '') => {
      const found: ITool | undefined = state.tools.find((tool: ITool) => tool.name === name)
      if (found && property) {
        return found[property]
      } else if (found && !property) {
        return found
      }
    },
    enabledTool: state => state.enabledTool,
    enabled: state => state.enabled
  },
  mutations: {
    SET_CURSOR_POSITION (state, payload) {
      state.x = payload.x
      state.y = payload.y
    },
    SET_ENABLED_TOOL (state, payload: string) {
      state.enabledTool = payload
    },
    SET_DISABLED_TOOL (state) {
      state.enabledTool = ''
    },
    SET_ENABLED (state) {
      state.enabled = true
    },
    SET_DISABLED (state) {
      state.enabled = false
    },
    SET_TOOL (state, payload: any) {
      let foundIndex = -1
      const found = state.tools.find((tool: ITool, index: number) => {
        foundIndex = index
        return tool.name === payload.name
      })
      if (found) {
        state.tools.splice(foundIndex, 1, { ...found, ...payload })
      }
    }
  },
  actions: {
    setCursorPosition (context, payload) {
      context.commit('SET_CURSOR_POSITION', payload)
    },
    setEnabledTool (context, payload) {
      context.commit('SET_ENABLED_TOOL', payload)
    },
    setDisabledTool (context) {
      context.commit('SET_DISABLED_TOOL')
    },
    setEnabled (context) {
      context.commit('SET_ENABLED')
    },
    setDisabled (context) {
      context.commit('SET_DISABLED')
    },
    setTool (context, payload) {
      context.commit('SET_TOOL', payload)
    }
  }
})
