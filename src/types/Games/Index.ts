import { JWTRegion } from '@/store/modules/app/authentication'
import { Game } from '@/store/types'

export interface ApiHeader {
  Authorization: string;
  'X-Region': JWTRegion;
  'X-Game': Game;
}
