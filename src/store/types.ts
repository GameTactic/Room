import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'

export interface Api {
  name: string;
  // eslint-disable-next-line
  data: any;
}

export interface Entity {
  id: number;
  text: string;
  shortText: string;
  value: string;
  image: string | undefined;
  type: string;
  // eslint-disable-next-line
  data: any;
}

export enum RoleTypes { 
  ROON_OWNER = 'roomOwner',
  ADMIN = 'admin'
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
  joined: Date;
  isAuthN: boolean;
  bannedBy: string | undefined;
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
  [key: string]: string | Map | CanvasElement[] | CanvasElementHistory[] | boolean | undefined;
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