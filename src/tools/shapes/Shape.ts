import Konva from 'konva'

export default class Shape {
  public group: Konva.Group
  constructor () {
    this.group = new Konva.Group()
  }
  getGroup = (): Konva.Group => this.group
}

export interface ShapeInterface {
  temporary: boolean;
  // eslint-disable-next-line
  [key: string]: any;
}

export interface CircleCreatorInterface extends ShapeInterface{
  size: number;
  colour: string;
  outlineColour: string;
  strokeStyle: number;
  showRadius: boolean;
}

export interface FreeDrawCreatorInterface extends ShapeInterface{
  size: number;
  colour: string;
}

export interface LineCreatorInterface extends ShapeInterface{
  size: number;
  colour: string;
  strokeStyle: number;
}

export interface PingCreatorInterface extends ShapeInterface{
  size: number;
  colour: string;
}

export interface RulerCreatorInterface extends ShapeInterface{
  size: number;
  colour: string;
  showCircle: boolean;
}

export interface TextCreatorInterface extends ShapeInterface{
  size: number;
  colour: string;
  textString: string;
}
