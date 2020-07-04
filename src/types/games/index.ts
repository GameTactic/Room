import { JWTRegion } from '@/store/modules/app/authentication'
import { Game } from '@/store/types'
import { Ship } from './wows'

export interface ApiHeader {
  Authorization: string;
  'X-Region': JWTRegion;
  'X-Game': Game;
}

export type GameEntity = Ship