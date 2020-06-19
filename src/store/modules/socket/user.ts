import { ActionContext, Module } from 'vuex'
import { User, Role, RoleTypes, RootState } from '../../types'
import { AppRoomGetters } from '../app/room'
import { AppAuthenticationGetters } from '../app/authentication'
import { Namespaces } from '@/store'

export enum SocketUserAction {
  SET_USERS = 'setUsers',
  SET_USER = 'setUser',
  UPDATE_USER = 'updateUser',
  DELETE_USER = 'deleteUser',
}

export enum SocketUserMutation {
  SET_USERS = 'SET_USERS',
  SET_USER = 'SET_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
}

export enum SocketUserGetters {
  USERS = 'users',
  USER = 'user',
  ONLINE_USERS = 'onlineUsers',
  OFFLINE_USERS = 'offlineUsers',
  IS_AUTHORISED = 'isAuthorised',
  IS_AUTHORISED_CANVAS_LOADED = 'isAuthorisedCanvasLoaded'
}

export interface SocketUserState {
  users: User[];
}

type SocketUserActionContext = ActionContext<SocketUserState, RootState>

const SocketUserModule: Module<SocketUserState, RootState> = {
  namespaced: true,
  state () {
    return {
      users: []
    }
  },
  getters: {
    [SocketUserGetters.USERS]: (state): User[] => state.users,
    [SocketUserGetters.ONLINE_USERS]: (state): User[] => state.users.filter((user: User) => user.isOnline),
    [SocketUserGetters.OFFLINE_USERS]: (state): User[] => state.users.filter((user: User) => !user.isOnline),
    [SocketUserGetters.USER]: (state) => (jti: string): User | undefined => state.users.find((user: User) => user.jti === jti),
    [SocketUserGetters.IS_AUTHORISED]: (state, _commit, _rootState, rootGetters): boolean => state.users.some((user: User) => user.jti === rootGetters[`${Namespaces.APP_AUTHENTICATION}/${AppAuthenticationGetters.JWT}`]?.jti && user.roles.some((role: Role) => role.roleTypes === RoleTypes['USER'])),
    [SocketUserGetters.IS_AUTHORISED_CANVAS_LOADED]: (_state, getters, _rootState, rootGetters): boolean => getters[SocketUserGetters.IS_AUTHORISED] && rootGetters[`${Namespaces.APP_ROOM}/${AppRoomGetters.IS_CANVAS_LOADED}`]
  },
  mutations: {
    [SocketUserMutation.SET_USERS] (state: SocketUserState, payload: User[]) {
      state.users = payload
    },
    [SocketUserMutation.SET_USER] (state: SocketUserState, payload: User) {
      state.users.push(payload)
    },
    [SocketUserMutation.UPDATE_USER] (state: SocketUserState, payload: User) {
      state.users.splice(state.users.findIndex((user: User) => user.jti === payload.jti), 1, payload)
    },
    [SocketUserMutation.DELETE_USER] (state: SocketUserState, jti: string) {
      state.users.splice(state.users.findIndex((user: User) => user.jti === jti), 1)
    }
  },
  actions: {
    [SocketUserAction.SET_USERS] (context: SocketUserActionContext, payload: User[]) {
      context.commit('SET_USERS', payload)
    },
    [SocketUserAction.SET_USER] (context: SocketUserActionContext, payload: User) {
      context.commit('SET_USER', payload)
    },
    [SocketUserAction.UPDATE_USER] (context: SocketUserActionContext, payload: User) {
      context.commit('UPDATE_USER', payload)
    },
    [SocketUserAction.DELETE_USER] (context: SocketUserActionContext, jti: string) {
      context.commit('DELETE_USER', jti)
    }
  }
}

export default SocketUserModule
