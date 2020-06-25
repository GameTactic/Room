import { Game } from '@/store/types'

export const getGameName = (game: Game): string => {
  switch (game) {
    case Game.WOWS: return 'Ships'
    case Game.WOT: return 'Tank'
    default: return ''
  }
}
