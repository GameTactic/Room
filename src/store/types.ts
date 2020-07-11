import { CanvasElement, CanvasElementHistory } from '@/types/canvas'
import { Namespaces } from '.'
import { AppAuthenticationState } from './modules/app/authentication'
import { AppLayerState } from './modules/app/layer'
import { AppRoomState } from './modules/app/room'
import { AppStageState } from './modules/app/stage'
import { AppToolState } from './modules/app/tools'
import { SocketCanvasState } from './modules/socket/canvas'
import { SocketRoomState } from './modules/socket/room'
import { SocketStageState } from './modules/socket/stage'
import { SocketTacticState } from './modules/socket/tactic'
import { SocketUserState } from './modules/socket/user'
import { Dimensions } from '@/mixins/stageWatcher'
import { GameEntity } from '@/types/games'

export enum RoleTypes {
  ROOM_OWNER = 'roomOwner',
  ADMIN = 'admin',
  USER = 'user'
}

export enum Game {
  NONE = 'none',
  WOWS = 'wows',
  WOT = 'wot'
}

export interface RootState {
  [Namespaces.APP_AUTHENTICATION]: AppAuthenticationState;
  [Namespaces.APP_LAYER]: AppLayerState;
  [Namespaces.APP_ROOM]: AppRoomState;
  [Namespaces.APP_STAGE]: AppStageState;
  [Namespaces.APP_TOOLS]: AppToolState;
  [Namespaces.SOCKET_CANVAS]: SocketCanvasState;
  [Namespaces.SOCKET_ROOM]: SocketRoomState;
  [Namespaces.SOCKET_STAGE]: SocketStageState;
  [Namespaces.SOCKET_TACTIC]: SocketTacticState;
  [Namespaces.SOCKET_USER]: SocketUserState;
}

export interface Api {
  name: string;
  data: ApiData;
}

export interface ApiData {
  name: string;
}

export interface Entity {
  id: string;
  game: Game;
  name: string;
  title: string;
  image: string;
  canvasImage: {
    image: string;
    dimensions: Dimensions;
  };
  teamId?: string;
  alias?: string;
  color?: string;
}

export interface Role {
  id: string;
  roleTypes: RoleTypes;
  assignedBy: string;
}

export interface User {
  jti: string;
  name: string;
  onTacticId: string;
  isOnline: boolean;
  lastOnline: Date | undefined;
  roles: Role[];
}

export interface Map {
  desc: string;
  name: string;
  icon: string;
  ratio: number;
  height: number;
  width: number;
}

export interface Tactic {
  id: string;
  name: string;
  collectionId: string;
  lockedBy: string | undefined;
  map: Map;
  isPinned: boolean;
  createdBy: string;
  canvasElements: CanvasElement[];
  canvasElementsHistory: CanvasElementHistory[];
  teams: Team[];
  [key: string]: string | Map | Team[] | CanvasElement[] | CanvasElementHistory[] | boolean | undefined;
}

export type ToggleLockTactic = {
  tacticId: string;
  jti: string;
}

export type DuplicateTactic = {
  tactic: Tactic;
  jti: string;
}

export interface Team {
  id: string;
  tacticId: string;
  name: string;
  color: string;
  entities: GameEntity[];
}

export interface Collection {
  id: string;
  parentCollectionId: string | undefined;
  name: string;
  lockedBy: string | undefined;
  isPinned: boolean;
  createdBy: string;
}

export interface PresentationPayload {
  enabledBy: string;
  tacticId: string;
}

export interface Presentation {
  enabledBy: string | undefined;
  tacticId: string | undefined;
}

export interface AddTeamToEntity {
  teamId: string;
  entity: GameEntity;
}
