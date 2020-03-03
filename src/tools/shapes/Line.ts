import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'

export default class Line {
  private line: Konva.Line
  private arrow: Konva.Arrow
  private tBar: Konva.Line
  private stroke: number[][]
  constructor (public size: number,
               public colour: string,
               public strokeStyle: number) {
    this.line = new Konva.Line()
    this.arrow = new Konva.Arrow()
    this.tBar = new Konva.Line()
    this.stroke = [
      [0, 0],
      [30, 10]
    ]
  }

  createLINE = (canvasElement: CanvasElement, layer: Konva.Layer): object => {
    this.line = this.createLineElement(canvasElement)
    layer.add(this.line)
    return {
      line: this.line,
      arrow: null,
      tBar: null
    }
  }

  createARROW = (canvasElement: CanvasElement, layer: Konva.Layer): object => {
    this.arrow = this.createArrowElement(canvasElement)
    layer.add(this.arrow)
    return {
      line: null,
      arrow: this.arrow,
      tBar: null
    }
  }

  createTBAR = (canvasElement: CanvasElement, layer: Konva.Layer): object => {
    this.line = this.createLineElement(canvasElement)
    this.tBar = this.createTElement(canvasElement)
    layer.add(this.tBar)
    layer.add(this.line)
    return {
      line: this.line,
      arrow: null,
      tBar: this.tBar
    }
  }

  // eslint-disable-next-line
  moveLINE = (canvasElement: CanvasElement, layer: Konva.Layer, pos: any, line: Konva.Line, arrow: Konva.Arrow, tBar: Konva.Line): void => {
    line.points([canvasElement.data[0], canvasElement.data[1], pos.x, pos.y])
  }

  // eslint-disable-next-line
  moveARROW = (canvasElement: CanvasElement, layer: Konva.Layer, pos: any, line: Konva.Line, arrow: Konva.Arrow, tBar: Konva.Line): void => {
    arrow.points([canvasElement.data[0], canvasElement.data[1], pos.x, pos.y])
  }

  // eslint-disable-next-line
  moveTBAR = (canvasElement: CanvasElement, layer: Konva.Layer, pos: any, line: Konva.Line, arrow: Konva.Arrow, tBar: Konva.Line): void => {
    tBar.points(this.calcTBar(canvasElement.data[0], canvasElement.data[1], pos.x, pos.y))
    line.points([canvasElement.data[0], canvasElement.data[1], pos.x, pos.y])
  }

  calcTBar = (x1: number, y1: number, x2: number, y2: number): number[] => {
    if (x2 === null || y2 === null || x2 === undefined || y2 === undefined) {
      return [0, 0]
    } else {
      const distance = 15
      const f = (-1 * (x2 - x1))
      const d = (-1 * (y2 - y1))
      if (f === 0 || d === 0) {
        return [0, 0]
      } else {
        let AB = []
        if (Math.abs(f) < Math.abs(d)) {
          AB = [f / d, 1]
        } else {
          AB = [1, d / f]
        }
        const ABInv = [AB[1] * -1, AB[0]]
        const length = Math.sqrt(Math.pow(ABInv[0] * distance, 2) + Math.pow(ABInv[1] * distance, 2))
        const offset = distance - ((length - distance) / Math.sqrt(2))
        const xx1 = x2 + ABInv[0] * offset
        const yy1 = y2 + ABInv[1] * offset
        const xx2 = x2 + ABInv[0] * -offset
        const yy2 = y2 + ABInv[1] * -offset
        return [xx1, yy1, xx2, yy2]
      }
    }
  }

  createLineElement = (canvasElement: CanvasElement, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data,
      stroke: colour || this.colour,
      strokeWidth: size || this.size,
      lineCap: 'mitter',
      id: canvasElement.id,
      dash: this.stroke[this.strokeStyle]
    })
  }

  createTElement = (canvasElement: CanvasElement, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    const point = this.calcTBar(canvasElement.data[0], canvasElement.data[1], canvasElement.data[2], canvasElement.data[3])
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: point,
      stroke: colour || this.colour,
      strokeWidth: size || this.size,
      lineCap: 'mitter',
      id: canvasElement.id
    })
  }

  createArrowElement = (canvasElement: CanvasElement, colour?: string, size?: number): Konva.Shape & Konva.Arrow => {
    return new Konva.Arrow({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data,
      stroke: colour || this.colour,
      strokeWidth: size || this.size,
      lineCap: 'mitter',
      id: canvasElement.id,
      dash: this.stroke[this.strokeStyle],
      fill: this.colour
    })
  }
}
