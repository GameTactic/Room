import { ApiData, Entity, Map } from '@/store/types'

export interface WowsShipsApiResponse {
  data: {
    status: string;
    meta: {
      count: number;
      page_total: number;
      total: number;
      limit: number;
      page: number;
    };
    data: {
      [key: string]: ApiShipResponse;
    };
  };
}

export interface Ship extends Entity {
  tier: number;
  type: WowsShipType;
  default: boolean;
  data: {
    artillery: number | undefined;
    hydro: number | undefined;
    radar: number | undefined;
    torpedo: number | undefined;
    concealmentPlane: number | undefined;
    concealmentShip: number | undefined;
    atbas: number | undefined;
  };
}

export enum WowsShipType {
  DESTROYER = 'Destroyer',
  AIR_CARRIER = 'AirCarrier',
  CRUISER = 'Cruiser',
  BATTLESHIP = 'Battleship'
}

export interface WowsShipDataApi extends ApiData {
  ships: Ship[];
}

export interface WowsMapsDataApi extends ApiData {
  maps: Map[];
}

export interface WowsShipInfoApiResponse {
  data: {
    status: string;
    meta: {
      count: number;
    };
    data: GameInfo;
  };
}

export interface ShipData {
  atbas: {
    distance: number | undefined;
  };
  artillery: {
    distance: number | undefined;
  };
  torpedoes: {
    distance: number | undefined;
  };
  concealment: {
    detect_distance_by_plane: number | undefined;
    detect_distance_by_ship: number | undefined;
  };
}

export interface ApiShipResponse {
  is_special: boolean;
  is_premium: boolean;
  ship_id: number;
  default_profile: ShipData;
  tier: number;
  name: string;
  type: string;
}

export interface GameInfo {
  ship_types: {
    [key: string]: string;
  };
  ship_type_images: {
    [key: string]: {
      image_premium: string;
      image: string;
      image_elite: string;
    };
  };
}
