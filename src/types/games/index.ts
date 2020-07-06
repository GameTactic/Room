import { JWTRegion } from '@/store/modules/app/authentication'
import { Game } from '@/store/types'
import { Ship } from './wows'

export interface ApiHeader {
  Authorization: string;
  'X-Region': JWTRegion;
  'X-Game': Game;
}

export interface Field {
  id: string;
  label: string;
  placeholder: string;
  suffix: string;
  [key: string]: string;
}

export type GameEntity = Ship
