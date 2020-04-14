import { GameInfo, Ship } from '@/store/modules/room';

interface WowsShipsApiResponse {
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

interface WowsShipInfoApiResponse {
  data: {
    status: string;
    meta: {
      count: number;
    };
    data: GameInfo;
  };
}

export { WowsShipsApiResponse, WowsShipInfoApiResponse }