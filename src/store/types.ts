import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'

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
  ROON_OWNER = 'roomOwner',
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
