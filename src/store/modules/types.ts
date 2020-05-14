import { GameName } from '@/store/modules/room'
import {CanvasElement, CanvasElementHistory} from '@/types/Canvas'

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
  height: number;
  width: number;
}

export interface Tactic {
  id: string;
  name: string;
  collectionId: string;
  lockedBy: string | undefined;
  map: Map;
  pinned: boolean;
  createdBy: string;
  canvasElements: CanvasElement[];
  canvasElementsHistory: CanvasElementHistory[];
  [key: string]: string | Map | CanvasElement[] | CanvasElementHistory[] | boolean | undefined;
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
