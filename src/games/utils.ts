import { Game } from '@/store/types'

type RomanNumeralLookup = {
  C: number;
  XC: number;
  L: number;
  XL: number;
  X: number;
  IX: number;
  V: number;
  IV: number;
  I: number;
  [key: string]: number;
}

type GameApiContents = {
  maps: string;
  entities: string;
}

type GameApiRoutes = {
  wows: GameApiContents;
  wot: GameApiContents;
  [key: string]: GameApiContents;
}

export const getEntityName = (game: Game): string => {
  switch (game) {
    case Game.WOWS: return 'Ship'
    case Game.WOT: return 'Tank'
    default: throw new Error(`game: ${game} in getEntityName found no match`)
  }
}

export const convertNumberToRomanNumeral = (num: number) => {
  const lookup: RomanNumeralLookup = {
    C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
  }
  let romanNumeral = ''
  let index: string | undefined
  for (index in lookup) {
    while (num >= lookup[index]) {
      romanNumeral += index
      num -= lookup[index]
    }
  }
  return romanNumeral
}

export const GameApiRoutes: GameApiRoutes = {
  wows: {
    maps: 'wows.encyclopedia.maps',
    entities: 'wows.encyclopedia.ships'
  },
  wot: {
    maps: '',
    entities: ''
  }
}
