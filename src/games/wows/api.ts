import { ApiHeader } from '@/types/games'
import { ApiShipResponse, EntitiesDataApi, MapsDataApi, Ship, WowsShipInfoApiResponse, WowsShipsApiResponse, WowsShipType } from '@/types/games/wows'
import axios from 'axios'
import { Api, Game, Map } from '@/store/types'
import { JWTRegion } from '@/store/modules/app/authentication'
import WowsMaps from '@/types/games/wows/maps'
import { v4 as uuid } from 'uuid'

export const getWowsApiData = async (token: string, setGameApi: (api: Api) => void): Promise<void> => {
  const scaleIcon = 0.8 // Sets default scale for all entities
  const colors: { [key: string]: string } = {
    AirCarrier: '#E53935',
    Battleship: '#FFB300',
    Cruiser: '#00897B',
    Destroyer: '#1E88E5'
  }
  const canvasIcons = {
    AirCarrier: {
      image: require('@/assets/games/wows/icons/AirCarrier.svg'),
      width: 34 * scaleIcon,
      height: 18 * scaleIcon
    },
    Battleship: {
      image: require('@/assets/games/wows/icons/Battleship.svg'),
      width: 34 * scaleIcon,
      height: 16 * scaleIcon
    },
    Cruiser: {
      image: require('@/assets/games/wows/icons/Cruiser.svg'),
      width: 34 * scaleIcon,
      height: 17 * scaleIcon
    },
    Destroyer: {
      image: require('@/assets/games/wows/icons/Destroyer.svg'),
      width: 33 * scaleIcon,
      height: 18 * scaleIcon
    }
  }
  const headers: ApiHeader = {
    Authorization: token,
    'X-Region': JWTRegion.EU,
    'X-Game': Game.WOWS
  }
  const gameInfo: WowsShipInfoApiResponse = await axios.get(`${process.env.VUE_APP_MS_WG_API}/wows/encyclopedia/info/`, { headers })
  const response: WowsShipsApiResponse = await axios.get(`${process.env.VUE_APP_MS_WG_API}/wows/encyclopedia/ships/`, { headers })
  const pageTotal = response.data.meta.page_total
  let apiShips: ApiShipResponse[] = []
  for (let i = 1; i <= pageTotal; i++) {
    const response: WowsShipsApiResponse = await axios.get(`${process.env.VUE_APP_MS_WG_API}/wows/encyclopedia/ships/?page_no=${i}`, { headers })
    apiShips = apiShips.concat(Object.values(response.data.data))
  }
  let ships: Ship[] = apiShips.map((ship: ApiShipResponse): Ship => ({
    id: uuid(),
    apiId: ship.ship_id.toString(),
    name: ship.name,
    title: ship.name,
    tier: ship.tier,
    type: ship.type as WowsShipType,
    game: Game.WOWS,
    color: colors[ship.type],
    image: gameInfo.data.data.ship_type_images[ship.type].image,
    canvasImage: {
      image: canvasIcons[ship.type as WowsShipType].image,
      dimensions: {
        width: canvasIcons[ship.type as WowsShipType].width,
        height: canvasIcons[ship.type as WowsShipType].height
      }
    },
    default: false,
    data: {
      artillery: ship.default_profile.artillery?.distance,
      torpedo: ship.default_profile.torpedoes?.distance,
      atbas: ship.default_profile.atbas?.distance,
      concealmentPlane: ship.default_profile.concealment?.detect_distance_by_plane,
      concealmentShip: ship.default_profile.concealment?.detect_distance_by_ship,
      hydro: undefined,
      radar: undefined
    }
  }))

  const defaultShips: Ship[] = [
    {
      id: '1',
      apiId: undefined,
      name: 'CV',
      title: 'Aircraft Carrier',
      tier: 0,
      type: WowsShipType.AIR_CARRIER,
      game: Game.WOWS,
      color: colors[WowsShipType.AIR_CARRIER],
      image: require('@/assets/games/wows/images/cv_image.png'),
      canvasImage: {
        image: canvasIcons.AirCarrier.image,
        dimensions: {
          width: canvasIcons.AirCarrier.width,
          height: canvasIcons.AirCarrier.height
        }
      },
      default: true,
      data: {
        artillery: undefined,
        torpedo: undefined,
        atbas: undefined,
        concealmentPlane: undefined,
        concealmentShip: undefined,
        hydro: undefined,
        radar: undefined
      }
    }, {
      id: '2',
      apiId: undefined,
      name: 'BB',
      title: 'Battleship',
      tier: 0,
      type: WowsShipType.BATTLESHIP,
      game: Game.WOWS,
      color: colors[WowsShipType.BATTLESHIP],
      image: require('@/assets/games/wows/images/bb_image.png'),
      canvasImage: {
        image: canvasIcons.Battleship.image,
        dimensions: {
          width: canvasIcons.Battleship.width,
          height: canvasIcons.Battleship.height
        }
      },
      default: true,
      data: {
        artillery: undefined,
        torpedo: undefined,
        atbas: undefined,
        concealmentPlane: undefined,
        concealmentShip: undefined,
        hydro: undefined,
        radar: undefined
      }
    }, {
      id: '3',
      apiId: undefined,
      name: 'CA',
      title: 'Cruiser',
      tier: 0,
      type: WowsShipType.CRUISER,
      game: Game.WOWS,
      color: colors[WowsShipType.CRUISER],
      image: require('@/assets/games/wows/images/ca_image.png'),
      canvasImage: {
        image: canvasIcons.Cruiser.image,
        dimensions: {
          width: canvasIcons.Cruiser.width,
          height: canvasIcons.Cruiser.height
        }
      },
      default: true,
      data: {
        artillery: undefined,
        torpedo: undefined,
        atbas: undefined,
        concealmentPlane: undefined,
        concealmentShip: undefined,
        hydro: undefined,
        radar: undefined
      }
    }, {
      id: '4',
      apiId: undefined,
      name: 'DD',
      title: 'Destroyer',
      tier: 0,
      type: WowsShipType.DESTROYER,
      game: Game.WOWS,
      color: colors[WowsShipType.DESTROYER],
      image: require('@/assets/games/wows/images/dd_image.png'),
      canvasImage: {
        image: canvasIcons.Destroyer.image,
        dimensions: {
          width: canvasIcons.Destroyer.width,
          height: canvasIcons.Destroyer.height
        }
      },
      default: true,
      data: {
        artillery: undefined,
        torpedo: undefined,
        atbas: undefined,
        concealmentPlane: undefined,
        concealmentShip: undefined,
        hydro: undefined,
        radar: undefined
      }
    }]

  ships = ships.concat(defaultShips)
  const maps: Map[] = new WowsMaps().getMaps()

  setGameApi({
    name: 'wows.encyclopedia.ships',
    data: {
      name: 'wows.encyclopedia.ships',
      entities: ships
    } as EntitiesDataApi
  })

  setGameApi({
    name: 'wows.encyclopedia.maps',
    data: {
      name: 'wows.encyclopedia.maps',
      maps: maps
    } as MapsDataApi
  })
}
