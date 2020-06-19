import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'
import { Namespaces } from '.'
import { AppAuthenticationState } from './modules/app/authentication'
import { AppCanvasEntityState } from './modules/app/canvasEntity'
import { AppLayerState } from './modules/app/layer'
import { AppRoomState } from './modules/app/room'
import { AppStageState } from './modules/app/stage'
import { AppToolState } from './modules/app/tools'
import { SocketCanvasState } from './modules/socket/canvas'
import { SocketRoomState } from './modules/socket/room'
import { SocketStageState } from './modules/socket/stage'
import { SocketTacticState } from './modules/socket/tactic'
import { SocketUserState } from './modules/socket/user'

export interface RootState {
  [Namespaces.APP_AUTHENTICATION]: AppAuthenticationState;
  [Namespaces.APP_CANVAS_ENTITY]: AppCanvasEntityState;
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
  name: string;
  image: string;
  team?: Team;
  game: Game;
  color?: string;
}

export enum RoleTypes {
  ROOM_OWNER = 'roomOwner',
  ADMIN = 'admin',
  USER = 'user'
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

export enum Game {
  NONE = '',
  WOWS = 'wows',
  WOT = 'wot'
}

export interface Team {
  id: string;
  tacticId: string;
  name: string;
  color: string;
  entities: Entity[];
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
