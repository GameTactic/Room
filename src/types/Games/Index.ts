interface Item {
  text: string;
  shortText: string;
  value: number;
  tier: number;
  image: string | undefined;
  data: any;
}

interface Field {
  id: string;
  path: string;
  value: string;
  hide: boolean;
  label: string;
  placeholder: string;
  suffix: string;
}

export { Item, Field }