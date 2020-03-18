import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'

export type MouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket) => void;
export type MouseMoveAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket) => void;
export type MouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket) => void;
export type RenderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer) => void;
export type SendToWebSocket = (canvasElement: CanvasElement, socket: WebSocket) => void;

export interface Tool {
  name: string;
  temporary: boolean;
  colour?: string;
  size?: number;
  endStyle?: string;
  strokeStyle?: number;
  showRadius?: boolean;
  showCircle?: boolean;
  outlineColour?: string;
  erase?: string[];
  mouseDownAction?: MouseDownAction;
  mouseMoveAction?: MouseMoveAction;
  mouseUpAction?: MouseUpAction;
  renderCanvas?: RenderCanvas;
  sendToWebSocket?: SendToWebSocket;
  // eslint-disable-next-line
  [key: string]: any;
}

export enum Tracker {
  ADDITION = 'addition',
  REMOVAL = 'removal',
  UNDO = 'undo',
  REDO = 'redo'
}
