import { ActionContext, Module } from 'vuex'
import { Entity, Team, AddTeamToEntity } from '@/store/types'
import { Namespaces } from '@/store'
import { GameEntity } from '@/types/games'

export enum SocketTeamAction {
  SET_TEAMS = 'setTeams',
  SET_SELECTED_TEAM = 'setSelectedTeam',
  ADD_ENTITY_TO_TEAM = 'addEntityToTeam',
  UPDATE_ENTITY_IN_TEAM = 'updateEntityInTeam',
  DELETE_ENTITY_FROM_TEAM = 'deleteEntityFromTeam'
}

export enum SocketTeamMutation {
  SET_TEAMS = 'SET_TEAMS',
  SET_SELECTED_TEAM = 'SET_SELECTED_TEAM',
  ADD_ENTITY_TO_TEAM = 'ADD_ENTITY_TO_TEAM',
  UPDATE_ENTITY_IN_TEAM = 'UPDATE_ENTITY_IN_TEAM',
  DELETE_ENTITY_FROM_TEAM = 'DELETE_ENTITY_FROM_TEAM'
}

export enum SocketTeamGetters {
  TEAMS = 'teams',
  TEAM = 'team',
  SELECTED_TEAM = 'selectedTeam',
  ENTITY = 'entity'
}

export interface SocketTeamState {
  teams: Team[];
  selectedTeam: Team | undefined;
}

type SocketTeamActionContext = ActionContext<SocketTeamState, {}>

const SocketTeamModule: Module<SocketTeamState, {}> = {
  namespaced: true,
  state () {
    return {
      teams: [],
      selectedTeam: undefined,
      selectedEntity: undefined
    }
  },
  getters: {
    [SocketTeamGetters.TEAMS]: state => state.teams,
    [SocketTeamGetters.TEAM]: state => (id: string) => state.teams.find((team: Team) => team.id === id),
    [SocketTeamGetters.SELECTED_TEAM]: state => state.selectedTeam,
    [SocketTeamGetters.ENTITY]: state => (id: string) => state.teams.forEach((v: Team) => v.entities.find((e: Entity) => e.id === id))
  },
  mutations: {
    [SocketTeamMutation.SET_TEAMS] (state: SocketTeamState, payload: Team[]) {
      state.teams = payload
    },
    [SocketTeamMutation.SET_SELECTED_TEAM] (state: SocketTeamState, payload: Team) {
      state.selectedTeam = payload
    },
    [SocketTeamMutation.ADD_ENTITY_TO_TEAM] (state: SocketTeamState, payload: AddTeamToEntity) {
      const team: Team | undefined = state.teams.find((team: Team) => team.id === payload.teamId)
      if (team) {
        team.entities.push(payload.entity)
      }
    },
    [SocketTeamMutation.UPDATE_ENTITY_IN_TEAM] (state: SocketTeamState, updatedEntity: GameEntity) {
      const team: Team | undefined = state.teams.find((team: Team) => team.id === updatedEntity.teamId)
      if (team) {
        const foundEntityIndex: number = team.entities.findIndex((entity: Entity) => entity.id === updatedEntity.id)
        if (foundEntityIndex > -1) {
          team.entities.splice(foundEntityIndex, 1, updatedEntity)
        }
      }
    },
    [SocketTeamMutation.DELETE_ENTITY_FROM_TEAM] (state: SocketTeamState, deletedEntity: GameEntity) {
      const team: Team | undefined = state.teams.find((team: Team) => team.id === deletedEntity.teamId)
      if (team) {
        const foundEntityIndex: number | undefined = team?.entities.findIndex((entity: Entity) => entity.id === deletedEntity.id)
        if (foundEntityIndex > -1) {
          team.entities.splice(foundEntityIndex, 1)
        }
      }
    }
  },
  actions: {
    [SocketTeamAction.SET_TEAMS] (context: SocketTeamActionContext, payload: Team[]) {
      context.commit(SocketTeamMutation.SET_TEAMS, payload)
    },
    [SocketTeamAction.SET_SELECTED_TEAM] (context: SocketTeamActionContext, team: Team) {
      context.commit(SocketTeamMutation.SET_SELECTED_TEAM, team)
    },
    [SocketTeamAction.ADD_ENTITY_TO_TEAM] (context: SocketTeamActionContext, payload: { teamId: string; entity: Entity }) {
      context.commit(SocketTeamMutation.ADD_ENTITY_TO_TEAM, payload)
    },
    [SocketTeamAction.UPDATE_ENTITY_IN_TEAM] (context: SocketTeamActionContext, payload: Entity) {
      context.commit(SocketTeamMutation.UPDATE_ENTITY_IN_TEAM, payload)
    },
    [SocketTeamAction.DELETE_ENTITY_FROM_TEAM] (context: SocketTeamActionContext, entityId: string) {
      const entity = context.getters[`${Namespaces.SOCKET_TEAM}/${SocketTeamGetters.ENTITY}`](entityId)
      if (entity) {
        context.commit(SocketTeamMutation.DELETE_ENTITY_FROM_TEAM, entity)
      }
    }
  }
}

export default SocketTeamModule
