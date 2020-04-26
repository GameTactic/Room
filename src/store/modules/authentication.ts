import { ActionContext, Module } from 'vuex'
import axios from 'axios'
import { verify } from 'jsonwebtoken'
import { mapProviders, Providers } from '@/util/ProvidersUtil'

export const JWT_KEY = 'jsonwebtoken'

// Possible regions in the JWT token.
export enum JWTRegion {
  EU = 'eu',
  NA = 'na',
  RU = 'ru',
  SA = 'sa',
}

export interface JWT {
  iss: string; // Who issued it. Example: GameTactic.
  aud: string; // For what. Example: GameTactic.
  jti: string; // UUID. Identifier of user.
  iat: number; // JWT is not valid before this date. Unix datetime.
  exp: number; // JWT is not valid after this date. Unix datetime.
  username: string; // Viewable user identifier. Might not be unique.
  region: JWTRegion; // Region where user is located. See enum.
  // eslint-disable-next-line
}

export interface ExtendedJWT extends JWT {
  encoded: string; // Token in encoded format.
}

export interface AuthenticationState {
  jwt: ExtendedJWT | null;
  providers: Providers;
}

export enum AuthenticationActions {
  AUTHENTICATE = 'authenticate',
  LOGIN_WG = 'auth_wg',
  LOGOUT = 'logout',
  STORE_TOKEN = 'storeToken',
  LOAD_PROVIDERS = 'loadProviders'
}

export enum AuthenticationMutation {
  SET_AUTHENTICATION_TOKEN = 'SET_AUTHENTICATION_TOKEN',
  SET_PROVIDERS = 'SET_PROVIDERS'
}

export enum AuthenticationGetters {
  JWT = 'jwt',
  IS_AUTH = 'authenticated',
  PROVIDER_NAMES = 'providers',
  PROVIDER = 'provider',
  PROVIDERS = 'providers'
}

type AuthenticationActionContext = ActionContext<AuthenticationState, {}>

const AuthenticationModule: Module<AuthenticationState, {}> = {
  namespaced: true,
  state () {
    return {
      jwt: null,
      providers: {}
    }
  },
  getters: {
    [AuthenticationGetters.JWT]: state => state.jwt,
    [AuthenticationGetters.IS_AUTH]: state => state.jwt !== null,
    [AuthenticationGetters.PROVIDER_NAMES]: state => Object.getOwnPropertyNames(state.providers),
    [AuthenticationGetters.PROVIDERS]: state => state.providers,
    [AuthenticationGetters.PROVIDER]: state => (name: string) => state.providers[name]
  },
  mutations: {
    [AuthenticationMutation.SET_AUTHENTICATION_TOKEN] (state: AuthenticationState, payload: ExtendedJWT) {
      state.jwt = payload
    },
    [AuthenticationMutation.SET_PROVIDERS] (state: AuthenticationState, payload: Providers) {
      state.providers = payload
    }
  },
  actions: {
    async [AuthenticationActions.AUTHENTICATE] (context: AuthenticationActionContext, token: string) {
      const response = await axios.get((process.env.VUE_APP_MS_AUTH as string))
      if (response.status !== 200) {
        throw Error('Could not reach authentication server.')
      }

      const jwt = verify(token, response.data.publicKey) as JWT
      const extended: ExtendedJWT = { ...jwt, ...{ encoded: token } }

      context.commit('SET_AUTHENTICATION_TOKEN', extended)
      return extended
    },
    [AuthenticationActions.STORE_TOKEN] (context: AuthenticationActionContext, token: string) {
      localStorage.setItem(JWT_KEY, token)
    },
    [AuthenticationActions.LOGIN_WG] (context: AuthenticationActionContext, endpoint: string) {
      const returnUrl = `${process.env.VUE_APP_MS_AUTH}${endpoint}/${window.location.href}`
      location.assign(returnUrl)
    },
    [AuthenticationActions.LOGOUT] (context: AuthenticationActionContext) {
      localStorage.removeItem(JWT_KEY)
      context.commit(AuthenticationMutation.SET_AUTHENTICATION_TOKEN, null)
    },
    async [AuthenticationActions.LOAD_PROVIDERS] (context: AuthenticationActionContext) {
      if (process.env.VUE_APP_MS_AUTH) {
        const response = await axios.get(process.env.VUE_APP_MS_AUTH)
        if (response.status !== 200 || !(response.data?.providers)) {
          throw Error('Could not fetch authentication providers')
        }
        context.commit(AuthenticationMutation.SET_PROVIDERS, mapProviders(response.data.providers))
      } else {
        throw Error('Authentication URI is not set')
      }
    }
  }
}

export default AuthenticationModule
