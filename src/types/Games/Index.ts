import { JWTRegion } from '@/store/modules/app/authentication'
import { Game } from '@/store/modules/socket/room'

export interface Item {
  text: string;
  shortText: string;
  type: 'AirCarrier' | 'Battleship' | 'Cruiser' | 'Destroyer';
  value: number;
  tier: number;
  image: string | undefined;
  data: any;
}

export interface Field {
  id: string;
  path: string;
  value: string;
  hide: boolean;
  label: string;
  placeholder: string;
  suffix: string;
}

export interface ApiHeader {
  Authorization: string;
  'X-Region': JWTRegion;
  'X-Game': Game;
}
