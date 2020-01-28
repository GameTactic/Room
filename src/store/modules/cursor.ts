import { ActionContext, Module } from 'vuex'

interface CursorState {
  x: number;
  y: number;
}

type CursorActionContext = ActionContext<CursorState, {}>;

const CursorModule: Module<CursorState, {}> = {
  namespaced: true,
  state () {
    return {
      x: 0,
      y: 0
    }
  },
  mutations: {
    SET_CURSOR_POSITION (state: CursorState, payload: CursorState) {
      state.x = payload.x
      state.y = payload.y
    }
  },
  actions: {
    setCursorPosition (context: CursorActionContext, payload: CursorState) {
      context.commit('SET_CURSOR_POSITION', payload)
    }
  }
}

export default CursorModule
