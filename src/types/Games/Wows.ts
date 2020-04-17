import { GameInfo, Ship } from '@/store/modules/room'

interface ShipItem {
  text: string;
  value: number;
  tier: number;
  image: string | undefined;
}

interface ShipField {
  id: string;
  value: string;
  hide: boolean;
  label: string;
  placeholder: string;
  saved: boolean | undefined;
  suffix: string;
  canvas: {
    isVisible: boolean;
    showIcon: boolean;
  };
}

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

export { ShipItem, ShipField, WowsShipsApiResponse, WowsShipInfoApiResponse }
