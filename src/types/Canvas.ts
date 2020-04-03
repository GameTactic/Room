import Konva from 'konva'
import { Tool, Tracker } from '@/tools/Tool'

export type VueKonvaLayer = Konva.Layer & Vue & {
  getNode: Function;
}

export type VueKonvaStage = Konva.Stage & Vue & {
  getNode: Function;
}

export interface CanvasElement {
  id: string;
  tool: Tool;
  data: number[];
  layerId: string;
  jti: string;
  tracker: Tracker;
  change: boolean;
  hasMoved: boolean;
  position: { x: number, y: number };
}
