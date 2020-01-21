import Konva from 'konva'

export type PointerHandler = (e: Konva.KonvaPointerEvent, stage: Konva.Stage | null, layer: Konva.Layer) => void;


export interface Tool {
  name: string;
  colour: string;
  size: number;
  action: PointerHandler;

  [key: string]: any;
}
