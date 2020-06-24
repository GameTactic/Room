import Konva from 'konva'
import { Tool, Tracker } from '@/tools/Tool'

export type VueKonvaLayer = Konva.Layer & Vue & {
  getNode: Function;
}

export type VueKonvaStage = Konva.Stage & Vue & {
  getNode: Function;
}

export enum AdditionTools {
  CIRCLE = 'circle',
  ENTITY = 'entity',
  FREEDRAW = 'freeDraw',
  RULER = 'ruler',
  LINE = 'line',
  PING = 'ping',
  TEXT = 'text',
}

export enum RemovalTools {
  ERASER = 'erase'
}

export enum CanvasElementType {
  MAP = 'map',
  SHAPE = 'shape',
  ENTITY = 'entity',
  TRANSFORMER = 'transformer',
  MASK = 'mask'
}

export interface CanvasElement {
  id: string;
  tool: Tool;
  type: CanvasElementType;
  data: {};
  layerId: string;
  jti: string;
  isVisible: boolean;
  attrs: {
    position: Point;
    rotation: number;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
  };
}

export interface CanvasElementHistory {
  id: string;
  jti: string;
  modifyType: Tracker;
  modifyData: AdditionData | RedoData | UndoData | TransformData | RemovalData;
  timestampModified: number;
}

export interface RequestCanvasEntity {
  id: string;
  jti: string;
  modifyData: AdditionData | RedoData | UndoData | TransformData | RemovalData;
  modifyType: Tracker;
  timestampModified: number;
  canvasElements: CanvasElement[];
}

export interface TransformData {
  from: CanvasElement['attrs'];
  to: CanvasElement['attrs'];
  groups: string[];
}

// Array of canvas element IDs to remove
export interface RemovalData {
  removals: string[];
}

// String containing the ID of the history element to redo
export interface RedoData {
  historyId: string;
}

// String containing the ID of the history element to undo
export interface UndoData {
  historyId: string;
}

// Array of canvas element IDs to add
export interface AdditionData {
  additions: string[];
  tool: AdditionTools;
}

export interface Point {
  x: number;
  y: number;
}
