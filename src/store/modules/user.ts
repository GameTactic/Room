import { ActionContext, Module } from 'vuex'
import { User } from './types'

export enum UserAction {
  SET_USERS = 'setUsers',
  SET_USER = 'setUser',
  UPDATE_USER = 'updateUser',
  DELETE_USER = 'deleteUser',
}

export enum UserMutation {
  SET_USERS = 'SET_USERS',
  SET_USER = 'SET_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
}

export enum UserGetters {
  USERS = 'users',
  USER = 'user',
}

export interface UserState {
  users: User[];
}

type UserActionContext = ActionContext<UserState, {}>

const UserModule: Module<UserState, {}> = {
  namespaced: true,
  state () {
    return {
      users: []
    }
  },
  getters: {
    [UserGetters.USERS]: state => state.users,
    [UserGetters.USER]: (state) => (jti: string) => state.users.find((user: User) => user.jti === jti)
  },
  mutations: {
    [UserMutation.SET_USERS] (state: UserState, payload: User[]) {
      state.users = payload
    },
    [UserMutation.SET_USER] (state: UserState, payload: User) {
      state.users.push(payload)
    },
    [UserMutation.UPDATE_USER] (state: UserState, payload: User) {
      state.users.splice(state.users.findIndex((user: User) => user.jti === payload.jti), 1, payload)
    },
    [UserMutation.DELETE_USER] (state: UserState, jti: string) {
      state.users.splice(state.users.findIndex((user: User) => user.jti === jti), 1)
    }
  },
  actions: {
    [UserAction.SET_USERS] (context: UserActionContext, payload: User[]) {
      context.commit('SET_USERS', payload)
    },
    [UserAction.SET_USER] (context: UserActionContext, payload: User) {
      context.commit('SET_USER', payload)
    },
    [UserAction.UPDATE_USER] (context: UserActionContext, payload: User) {
      context.commit('UPDATE_USER', payload)
    },
    [UserAction.DELETE_USER] (context: UserActionContext, jti: string) {
      context.commit('DELETE_USER', jti)
    }
  }
}

export default UserModule
