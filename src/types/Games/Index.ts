import { JWTRegion } from '@/store/modules/authentication';
import { GameName } from '@/store/modules/room';

export interface Item {
  text: string;
  shortText: string;
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
  'X-Game': GameName;
}