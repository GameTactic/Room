import Konva from 'konva';
import { Tool } from '../tools/Tool'

export type VueKonvaLayer = Konva.Layer & Vue & {
  getNode: Function
}

export type VueKonvaStage = Konva.Stage & Vue & {
  getNode: Function
}

export interface Data {
  x: number;
  y: number;
}

export interface CanvasElementPayload {
  tool: Tool;
  immediate: boolean;
  data: Data[];
}

export interface CanvasElement extends CanvasElementPayload{
  id: string;
  jti: string;
}
