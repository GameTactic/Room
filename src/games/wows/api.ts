import { ApiHeader } from '@/types/Games/Index'
import { ApiShipResponse, EntitiesDataApi, MapsDataApi, Ship, WowsShipInfoApiResponse, WowsShipsApiResponse, WowsShipType } from '@/types/Games/Wows'
import axios from 'axios'
import { Api, Game, Map } from '@/store/types'
import { JWTRegion } from '@/store/modules/app/authentication'
import WowsMaps from '@/types/Games/Wows/Maps'
import uuid from 'uuid'

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
    'Authorization': token,
    'X-Region': JWTRegion['EU'],
    'X-Game': Game['WOWS']
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
    id: `${ship.ship_id}`,
    uuid: uuid(),
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
      uuid: uuid(),
      name: 'CV',
      title: 'Aircraft Carrier',
      tier: 0,
      type: WowsShipType.AIR_CARRIER,
      game: Game.WOWS,
      color: colors[WowsShipType.AIR_CARRIER],
      image: 'https://glossary-wows-global.gcdn.co/icons/vehicle/types/AirCarrier/standard_84f55678325d4b492215390a7f0b43008f3947ab201502cd979dcf4c37633cf3.png',
      canvasImage: {
        image: canvasIcons.AirCarrier.image,
        dimensions: {
          width: canvasIcons.AirCarrier.width,
          height: canvasIcons.AirCarrier.height
        }
      },
      default: true,
      data: {
        artillery: 0,
        torpedo: undefined,
        atbas: undefined,
        concealmentPlane: undefined,
        concealmentShip: undefined,
        hydro: undefined,
        radar: undefined
      }
    }, {
      id: '2',
      uuid: uuid(),
      name: 'BB',
      title: 'Battleship',
      tier: 0,
      type: WowsShipType.BATTLESHIP,
      game: Game.WOWS,
      color: colors[WowsShipType.BATTLESHIP],
      image: 'https://glossary-wows-global.gcdn.co/icons/vehicle/types/Battleship/standard_01624cacb82f39f77a4e677a7b9fdf4df20dafd61f971f4b2d3e54c3065e2892.png',
      canvasImage: {
        image: canvasIcons.Battleship.image,
        dimensions: {
          width: canvasIcons.Battleship.width,
          height: canvasIcons.Battleship.height
        }
      },
      default: true,
      data: {
        artillery: 0,
        torpedo: undefined,
        atbas: undefined,
        concealmentPlane: undefined,
        concealmentShip: undefined,
        hydro: undefined,
        radar: undefined
      }
    }, {
      id: '3',
      uuid: uuid(),
      name: 'CA',
      title: 'Cruiser',
      tier: 0,
      type: WowsShipType.CRUISER,
      game: Game.WOWS,
      color: colors[WowsShipType.CRUISER],
      image: 'https://glossary-wows-global.gcdn.co/icons/vehicle/types/Cruiser/standard_874a3bdc3134b8da4fd6f52186f1b2b682f13ef78688732d3016785c0649a424.png',
      canvasImage: {
        image: canvasIcons.Cruiser.image,
        dimensions: {
          width: canvasIcons.Cruiser.width,
          height: canvasIcons.Cruiser.height
        }
      },
      default: true,
      data: {
        artillery: 0,
        torpedo: undefined,
        atbas: undefined,
        concealmentPlane: undefined,
        concealmentShip: undefined,
        hydro: undefined,
        radar: undefined
      }
    }, {
      id: '4',
      uuid: uuid(),
      name: 'DD',
      title: 'Destroyer',
      tier: 0,
      type: WowsShipType.DESTROYER,
      game: Game.WOWS,
      color: colors[WowsShipType.DESTROYER],
      image: 'https://glossary-wows-global.gcdn.co/icons/vehicle/types/Destroyer/standard_357acc9fc0e2f7d98f047c99edffad359a8c45f2093024400fef2b9abbaf3a59.png',
      canvasImage: {
        image: canvasIcons.Destroyer.image,
        dimensions: {
          width: canvasIcons.Destroyer.width,
          height: canvasIcons.Destroyer.height
        }
      },
      default: true,
      data: {
        artillery: 0,
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
