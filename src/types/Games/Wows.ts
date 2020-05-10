import { GameName } from '@/store/modules/room'

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
      [key: string]: Ship;
    };
  };
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
  engine: {
    engine_id_str: string;
    max_speed: number;
    engine_id: number;
  };
  anti_aircraft: {
    slots: {
      distance: number;
      avg_damage: number;
      caliber: number;
      name: string;
      guns: number;
    }[];
  };
  mobility: {
    rudder_time: number;
    total: number;
    turning_radius: number;
    max_speed: number;
  };
  hull: {
    hull_id: number;
    hull_id_str: string;
    torpedoes_barrels: number;
    anti_aircraft_barrels: number;
  };
  atbas: {
    distance: number;
  };
  artillery: {
    max_dispersion: number;
    shot_delay: number;
    rotation_time: number;
    distance: number;
  };
  torpedoes: {
    visibility_dist: number;
    distance: number;
    torpedoes_id: number;
    torpedo_name: string;
    reload_time: number;
    torpedo_speed: number;
    rotation_time: number;
    torpedoes_id_str: string;
    max_damage: number;
  };
  ship_id: number;
  fire_control: {
    fire_control_id: number;
    distance: number;
    distance_increase: number;
    fire_control_id_str: string;
  };
  weaponry: {
    anti_aircraft: number;
    aircraft: number;
    artillery: number;
    torpedoes: number;
  };
  battle_level_range_max: number;
  battle_level_range_min: number;
  flight_control: null;
  concealment: {
    total: number;
    detect_distance_by_plane: number;
    detect_distance_by_ship: number;
  };
  armour: {
    casemate: {
      max: number;
      min: number;
    };
  };
}

export interface Ship {
  description: string;
  price_gold: number;
  ship_id_str: string;
  has_demo_profile: boolean;
  images: {
    small: string;
    medium: string;
    large: string;
    contour: string;
  };
  modules: string;
  modules_tree: string;
  nation: string;
  is_premium: boolean;
  ship_id: number;
  price_credit: 0;
  default_profile: string;
  upgrades: number[];
  tier: number;
  next_ships: string;
  mod_slots: number;
  type: string;
  is_special: boolean;
  name: string;
}

type ShipTypeImages = {
  image_premium: string;
  image: string;
  image_elite: string;
}

export interface GameInfo {
  ships_updated_at: number;
  ship_types: {
    [key: string]: string;
  };
  languages: {
    [key: string]: string;
  };
  ship_modifications: {
    [key: string]: string;
  };
  ship_modules: {
    [key: string]: string;
  };
  ship_type_images: {
    [key: string]: ShipTypeImages;
  };
  ship_nations: {
    [key: string]: string;
  };
  game_version: string;
  [key: string]: string | number | { [key: string]: string } | { [key: string]: ShipTypeImages };
}
