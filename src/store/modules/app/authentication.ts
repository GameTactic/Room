import { ActionContext, Module } from 'vuex'
import axios from 'axios'
import { verify } from 'jsonwebtoken'
import i18n from '@/lib/I18n'
import { mapProviders, Providers } from '@/util/ProvidersUtil'

export const JWT_KEY = 'jsonwebtoken'

// Possible regions in the JWT token.
export enum JWTRegion {
  EU = 'eu',
  NA = 'na',
  RU = 'ru',
  SA = 'sa',
}

export function regionDomain (region: JWTRegion): string {
  switch (region) {
    case JWTRegion.EU:
      return 'eu'
    case JWTRegion.NA:
      return 'na'
    case JWTRegion.RU:
      return 'ru'
    case JWTRegion.SA:
      return 'asia'
  }
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

export interface AppAuthenticationState {
  jwt: ExtendedJWT | null;
  providers: Providers;
}

export interface RefreshTokenResponse {
  data: {
    token: string;
  };
  status: number;
}

export interface AuthenticationResponse {
  data: {
    issuer: string;
    audience: string;
    publicKey: string;
    currentToken: string;
    providers: {
      wargaming: {
        ru: string;
        eu: string;
        na: string;
        asia: string;
      };
    };
  };
  status: number;
}

export enum AppAuthenticationActions {
  AUTHENTICATE = 'authenticate',
  REFRESH_TOKEN = 'refreshToken',
  LOAD_PROVIDERS = 'loadProviders',
  LOGIN_WG = 'auth_wg',
  LOGOUT = 'logout',
  STORE_TOKEN = 'storeToken',
}

export enum AppAuthenticationMutation {
  SET_AUTHENTICATION_JWT = 'SET_AUTHENTICATION_JWT',
  SET_PROVIDERS = 'SET_PROVIDERS'
}

export enum AppAuthenticationGetters {
  JWT = 'jwt',
  IS_AUTH = 'authenticated',
  PROVIDER_NAMES = 'providers',
  PROVIDER = 'provider',
  PROVIDERS = 'providers'
}

type AppAuthenticationActionContext = ActionContext<AppAuthenticationState, {}>

const AppAuthenticationModule: Module<AppAuthenticationState, {}> = {
  namespaced: true,
  state () {
    return {
      jwt: null,
      providers: {}
    }
  },
  getters: {
    [AppAuthenticationGetters.JWT]: state => state.jwt,
    [AppAuthenticationGetters.IS_AUTH]: state => state.jwt !== null,
    [AppAuthenticationGetters.PROVIDER_NAMES]: state => Object.getOwnPropertyNames(state.providers),
    [AppAuthenticationGetters.PROVIDERS]: state => state.providers,
    [AppAuthenticationGetters.PROVIDER]: state => (name: string) => state.providers[name]
  },
  mutations: {
    [AppAuthenticationMutation.SET_AUTHENTICATION_JWT] (state: AppAuthenticationState, payload: ExtendedJWT) {
      state.jwt = payload
    },
    [AppAuthenticationMutation.SET_PROVIDERS] (state: AppAuthenticationState, payload: Providers) {
      state.providers = payload
    }
  },
  actions: {
    async [AppAuthenticationActions.AUTHENTICATE] (context: AppAuthenticationActionContext, token: string) {
      const response = await axios.get((process.env.VUE_APP_MS_AUTH as string))
      if (response.status !== 200) {
        throw Error(i18n.tc('authentication.error.reachServer'))
      }
      const jwt = verify(token, response.data.publicKey) as JWT
      const extendedToken: ExtendedJWT = { ...jwt, ...{ encoded: token } }

      context.commit(AppAuthenticationMutation.SET_AUTHENTICATION_JWT, extendedToken)
      context.dispatch(AppAuthenticationActions.STORE_TOKEN, token)
    },
    async [AppAuthenticationActions.REFRESH_TOKEN] (context: AppAuthenticationActionContext, token: string) {
      const response: RefreshTokenResponse = await axios.get(`${process.env.VUE_APP_MS_AUTH}/refresh/${token}`)
      const refreshToken: string = response.data.token
      if (refreshToken) {
        context.dispatch(AppAuthenticationActions.STORE_TOKEN, refreshToken)
      }
    },
    [AppAuthenticationActions.STORE_TOKEN] (context: AppAuthenticationActionContext, token: string) {
      localStorage.setItem(JWT_KEY, token)
    },
    [AppAuthenticationActions.LOGIN_WG] (context: AppAuthenticationActionContext, endpoint: string) {
      const returnUrl = `${process.env.VUE_APP_MS_AUTH}${endpoint}/${window.location.href}`
      location.assign(returnUrl)
    },
    [AppAuthenticationActions.LOGOUT] (context: AppAuthenticationActionContext) {
      localStorage.removeItem(JWT_KEY)
      context.commit(AppAuthenticationMutation.SET_AUTHENTICATION_JWT, null)
    },
    async [AppAuthenticationActions.LOAD_PROVIDERS] (context: AppAuthenticationActionContext) {
      if (process.env.VUE_APP_MS_AUTH) {
        const response = await axios.get(process.env.VUE_APP_MS_AUTH)
        if (response.status !== 200 || !(response.data?.providers)) {
          throw Error('Could not fetch authentication providers')
        }
        const providers = response.data.providers
        context.commit(AppAuthenticationMutation.SET_PROVIDERS, mapProviders(providers))
      } else {
        throw Error('Authentication URI is not set')
      }
    }
  }
}

export default AppAuthenticationModule
