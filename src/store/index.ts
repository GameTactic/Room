import Vue from 'vue'
import Vuex from 'vuex'
import { ITool } from '../types/canvas'

Vue.use(Vuex)

interface IVuexState {
  x: number;
  y: number;
  tools: ITool[]
}

export default new Vuex.Store<IVuexState>({
  state: {
    x: 0,
    y: 0,
    tools: [
      { name: 'ping', enabled: false }
    ]
  },
  getters: {
    tools: state => {
      return state.tools
    }
  },
  mutations: {
    SET_CURSOR_POSITION (state, payload) {
      state.x = payload.x
      state.y = payload.y
    },
    SET_TOOLS (state, payload: string) {
      const found = state.tools.find((tool) => tool.name === payload)
      if (found) {
        found.enabled = !found.enabled
      }
    }
  },
  actions: {
    setCursorPosition (context, payload) {
      context.commit('SET_CURSOR_POSITION', payload)
    },
    setTools (context, payload) {
      context.commit('SET_TOOLS', payload)
    }

  },
  modules: {
  }
})
