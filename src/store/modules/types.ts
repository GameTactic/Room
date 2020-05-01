import { GameName } from './room';

export interface Api {
  name: string;
  data: any;
}

export interface Entity {
  id: number;
  text: string;
  shortText: string;
  value: string;
  image: string | undefined;
  data: any;
}

export interface Game {
  name: GameName;
  api: Api[];
}

export interface User {
  jti: string;
  isRoomOwner: boolean;
  isAuthN: boolean;
}

export interface Map {
  desc: string;
  name: string;
  icon: string;
  ratio: number;
}

export interface Tactic {
  id: string;
  collectionId: boolean;
  isLocked: boolean;
  lockedBy: string | undefined;
  map: Map;
  entities: Entity[];
  createdBy: string;
}

export interface Collection {
  id: string;
  collectionId: string;
  isLocked: boolean;
  lockedBy: string | undefined;
  createdBy: string;
}

export interface PresentationPayload {
  isPresentationEnabled: boolean;
  presentationEnabledBy: string;
}
