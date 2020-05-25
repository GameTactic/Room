import { ActionContext, Module } from 'vuex'
import axios from 'axios'
import { verify } from 'jsonwebtoken'

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
}

export enum AppAuthenticationActions {
  AUTHENTICATE = 'authenticate',
  CHECK_TOKEN_EXPIRY = 'checkTokenExpiry',
  LOGIN_WG = 'auth_wg',
  LOGOUT = 'logout',
  STORE_TOKEN = 'storeToken'
}

export enum AppAuthenticationMutation {
  SET_AUTHENTICATION_TOKEN = 'SET_AUTHENTICATION_TOKEN'
}

export enum AppAuthenticationGetters {
  JWT = 'jwt',
  IS_AUTH = 'authenticated'
}

type AppAuthenticationActionContext = ActionContext<AppAuthenticationState, {}>

const AppAuthenticationModule: Module<AppAuthenticationState, {}> = {
  namespaced: true,
  state () {
    return {
      jwt: null
    }
  },
  getters: {
    [AppAuthenticationGetters.JWT]: state => state.jwt,
    [AppAuthenticationGetters.IS_AUTH]: state => state.jwt !== null
  },
  mutations: {
    [AppAuthenticationMutation.SET_AUTHENTICATION_TOKEN] (state: AppAuthenticationState, payload: ExtendedJWT) {
      state.jwt = payload
    }
  },
  actions: {
    async [AppAuthenticationActions.AUTHENTICATE] (context: AppAuthenticationActionContext, token: string) {
      // TODO: This is just placeholder logic. Please check it works. -Niko

      const response = await axios.get((process.env.VUE_APP_MS_AUTH as string))
      if (response.status !== 200) {
        throw Error('Could not reach authentication server.')
      }

      const jwt = verify(token, response.data.publicKey) as JWT
      const extended: ExtendedJWT = { ...jwt, ...{ encoded: token } }

      // TODO: You probably want put this into the `state`. -Niko
      // Im not sure how this should be done, so I did it as I know.
      context.commit('SET_AUTHENTICATION_TOKEN', extended)
      return extended
    },
    async [AppAuthenticationActions.CHECK_TOKEN_EXPIRY] (context: AppAuthenticationActionContext) {
      const response = await axios.get((process.env.VUE_APP_MS_AUTH as string))
      let isTokenValid = true
      if (response.status !== 200) {
        throw Error('Could not reach authentication server.')
      }
      const stateJwt = context.state.jwt
      if (stateJwt) {
        try {
          const verifiedToken = verify(stateJwt.encoded, response.data.publicKey) as JWT
          // eslint-disable-next-line
          console.log('verifiedToken', verifiedToken)
          isTokenValid = true
          // Need to handle tokens that are nearly expired - Sam
        } catch (error) {
          // Placeholder until modal has been created - Sam
          isTokenValid = false
          context.dispatch(AppAuthenticationActions.LOGOUT)
          alert('Your session has expired and you have been logged out. Please login again/')
        }
      }
      return isTokenValid
    },
    [AppAuthenticationActions.STORE_TOKEN] (context: AppAuthenticationActionContext, token: string) {
      localStorage.setItem(JWT_KEY, token)
    },
    [AppAuthenticationActions.LOGIN_WG] (context: AppAuthenticationActionContext, region: JWTRegion) {
      // TODO: This is just placeholder logic. Please check it works. -Niko
      const returnUrl = process.env.VUE_APP_MS_AUTH + `/connect/wargaming/${regionDomain(region)}/${window.location.href}`
      location.assign(returnUrl)
    },
    [AppAuthenticationActions.LOGOUT] (context: AppAuthenticationActionContext) {
      localStorage.removeItem(JWT_KEY)
      context.commit(AppAuthenticationMutation.SET_AUTHENTICATION_TOKEN, null)
    }
  }
}

export default AppAuthenticationModule
