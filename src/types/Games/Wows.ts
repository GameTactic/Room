
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
export { ShipItem, ShipField }