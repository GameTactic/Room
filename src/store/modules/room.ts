import { ActionContext, Module } from 'vuex'

export enum GameName {
  NONE = '',
  WOWS = 'wows',
  WOT = 'wot'
}

export enum Locale {
  ENUK = 'en-uk'
}

export enum RoomAction {
  SET_GAME = 'setGame',
  SET_LOCALE = 'setLocale'
}

export enum RoomMutation {
  SET_GAME = 'SET_GAME',
  SET_LOCALE = 'SET_LOCALE'
}

export enum RoomGetters {
  ROOM_STATE = 'roomState',
  ROOM_MAPS = 'roomMaps'
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

export interface Map {
  desc: string;
  icon: string;
  name: string;
  ratio: number;
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

export interface Game {
  name: GameName;
  ships: Ship[];
  maps: Map[];
  gameInfo: GameInfo | undefined;
}

export interface RoomState {
  game: Game;
  locale: Locale;
}

type CursorActionContext = ActionContext<RoomState, {}>

const RoomModule: Module<RoomState, {}> = {
  namespaced: true,
  state () {
    return {
      game: {
        name: GameName['NONE'],
        ships: [],
        maps: [],
        gameInfo: undefined
      },
      locale: Locale['ENUK']
    }
  },
  getters: {
    [RoomGetters.ROOM_STATE]: state => ({ game: state.game, locale: state.locale }),
    [RoomGetters.ROOM_MAPS]: state => state.game.maps
  },
  mutations: {
    [RoomMutation.SET_GAME] (state: RoomState, payload: Game) {
      state.game = payload
    },
    [RoomMutation.SET_LOCALE] (state: RoomState, payload: Locale) {
      state.locale = payload
    }
  },
  actions: {
    [RoomAction.SET_GAME] (context: CursorActionContext, payload: Game) {
      context.commit('SET_GAME', payload)
    },
    [RoomAction.SET_LOCALE] (context: CursorActionContext, payload: Locale) {
      context.commit('SET_LOCALE', payload)
    }
  }
}

export default RoomModule
