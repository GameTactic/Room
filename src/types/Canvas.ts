import Konva from 'konva'
import { Point } from 'konva/types/Util'
import { ToolInterface, Tracker } from '@/tools/Tool'

export type VueKonvaLayer = Konva.Layer & Vue & {
  getNode: Function;
}

export type VueKonvaStage = Konva.Stage & Vue & {
  getNode: Function;
}

export enum CanvasElementType {
  MAP = 'map',
  SHAPE = 'shape',
  ENTITY = 'entity'
}

export interface CanvasElement {
  id: string;
  tool: ToolInterface;
  type: CanvasElementType;
  data: {};
  layerId: string;
  jti: string;
  isVisible: boolean;
  position: Point;
}

export interface CanvasElementHistory {
  id: string;
  jti: string;
  modifyType: Tracker;
  modifyData: AdditionData | RedoData | UndoData | MoveData | RemovalData;
  timestampModified: number;
}

export interface RequestCanvasEntity {
  id: string;
  jti: string;
  modifyData: AdditionData | RedoData | UndoData | MoveData | RemovalData;
  modifyType: Tracker;
  timestampModified: number;
  canvasElements: CanvasElement[];
}

export interface MoveData {
  from: Point;
  to: Point;
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
}
