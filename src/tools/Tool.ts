import Konva from 'konva'
import { CanvasElementPayload, CanvasElement } from '@/types/Canvas';

export type PointerHandler = (e: Konva.KonvaPointerEvent, canvasElementPayload: CanvasElementPayload, layer: Konva.Layer, socket: WebSocket) => void;
export type RenderCanvas = ( canvasElement: CanvasElement, layer: Konva.Layer) => void;

export interface Tool {
  name: string;
  colour?: string;
  size?: number;
  mouseDownAction?: PointerHandler;
  mouseMoveAction?: PointerHandler;
  mouseUpAction?: PointerHandler;
  renderCanvas?: RenderCanvas;
  [key: string]: any;
}
