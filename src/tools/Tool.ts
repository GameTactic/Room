import Konva from 'konva'
import { CanvasElement, VueKonvaStage } from '@/types/Canvas'
import { CustomEvent } from '@/util/PointerEventMapper'

export type CanvasDownAction = (event: CustomEvent, stage: VueKonvaStage) => void;
export type CanvasMoveAction = (event: CustomEvent, stage: VueKonvaStage) => void;
export type CanvasUpAction = (event: CustomEvent, stage: VueKonvaStage) => void;
export type MouseDownAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket) => void;
export type MouseMoveAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket) => void;
export type MouseUpAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket) => void;
export type RenderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent) => void;
export type SendToWebSocket = (canvasElement: CanvasElement, socket: WebSocket) => void;

export interface Tool {
  name: string;
  // eslint-disable-next-line
  [key: string]: any
}

export interface CanvasToolInterface extends Tool {
  canvasDownAction: CanvasDownAction;
  canvasMoveAction: CanvasMoveAction;
  canvasUpAction: CanvasUpAction;
}

export interface ToolClassInterface extends Tool {
  mouseDownAction: MouseDownAction;
  mouseMoveAction: MouseMoveAction;
  mouseUpAction: MouseUpAction;
  renderCanvas: RenderCanvas;
  sendToWebSocket: SendToWebSocket;
}

export interface CircleInterface extends ToolClassInterface {
  colour: string;
  size: number;
  strokeStyle: number;
  outlineColour: string;
  showRadius: boolean;
  temporary: boolean;
}

export interface LineInterface extends ToolClassInterface {
  colour: string;
  size: number;
  endStyle: string;
  strokeStyle: number;
  temporary: boolean;
}

export interface MoveInterface extends ToolClassInterface {
  moveGroup: Konva.Group;
  temporary: boolean;
}

export interface PingInterface extends ToolClassInterface {
  colour: string;
  size: number;
  temporary: boolean;
}

export interface FreeDrawInterface extends ToolClassInterface {
  colour: string;
  size: number;
  temporary: boolean;
}

export interface RulerInterface extends ToolClassInterface {
  colour: string;
  size: number;
  temporary: boolean;
  showCircle: boolean;
}

export interface EraseInterface extends ToolClassInterface {
  erase: string[];
  temporary: boolean;
}

export interface TextInterface extends ToolClassInterface {
  colour: string;
  size: number;
  temporary: boolean;
  textString: string;
}

export enum Tracker {
  ADDITION = 'addition',
  REMOVAL = 'removal',
  UNDO = 'undo',
  REDO = 'redo',
  MOVE = 'move'
}
