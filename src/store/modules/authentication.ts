import { ActionContext, Module } from 'vuex'
import axios from 'axios'
import { verify } from 'jsonwebtoken'

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
}

export enum AuthenticationActions {
  AUTHENTICATE = 'authenticate',
  LOGIN_WG = 'auth_wg',
}

export enum AuthenticationMutation {
  SET_AUTHENTICATION_TOKEN = 'SET_AUTHENTICATION_TOKEN'
}

export enum AuthenticationGetters {
  JWT = 'jwt',
  IS_AUTH = 'authenticated'
}

type AuthenticationActionContext = ActionContext<AuthenticationState, {}>

const AuthenticationModule: Module<AuthenticationState, {}> = {
  namespaced: true,
  state () {
    return {
      jwt: null
    }
  },
  getters: {
    [AuthenticationGetters.JWT]: state => state.jwt,
    [AuthenticationGetters.IS_AUTH]: state => state.jwt !== null
  },
  mutations: {
    [AuthenticationMutation.SET_AUTHENTICATION_TOKEN] (state: AuthenticationState, payload: ExtendedJWT) {
      state.jwt = payload
    }
  },
  actions: {
    async [AuthenticationActions.AUTHENTICATE] (context: AuthenticationActionContext, token: string) {
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
    },
    async [AuthenticationActions.LOGIN_WG] (context: AuthenticationActionContext, region: string) {
      // TODO: This is just placeholder logic. Please check it works. -Niko
      location.replace(process.env.VUE_APP_MS_AUTH + `/connect/wargaming/${region}/${window.location.href}`)
    }
  }
}

export default AuthenticationModule
