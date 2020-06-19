import Konva from 'konva'
import { CanvasElementType } from '@/types/Canvas'

export default class Mask {
  private _mask: Konva.Rect
  constructor (public config: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    this._mask = new Konva.Rect({
      x: this.config.x,
      y: this.config.y,
      width: this.config.width,
      height: this.config.height,
      stroke: '#004e8c',
      dash: [5, 5]
    })
    this._mask.attrs.type = CanvasElementType.MASK
    this._mask.attrs.temporary = false
  }
  get mask (): Konva.Rect {
    return this._mask
  }

  set mask (value: Konva.Rect) {
    this._mask = value
  }
}
