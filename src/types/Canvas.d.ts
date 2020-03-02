import Konva from 'konva';
import { Tool } from '../tools/Tool'

export type VueKonvaLayer = Konva.Layer & Vue & {
  getNode: Function
}

export type VueKonvaStage = Konva.Stage & Vue & {
  getNode: Function
}

export interface CanvasElement {
  id: string;
  tool: Tool;
  temporary: boolean;
  data: number[];
  layerId: string;
  jti: string;
  endStyle?: string;
  strokeStyle?: number;
}
