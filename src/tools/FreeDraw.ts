import { Tool } from '@/tools/Tool'
import Konva from 'konva'

export default class FreeDraw implements Tool {
  // eslint-disable-next-line no-useless-constructor
  constructor (public readonly name: string,
               public size: number,
               public colour: string) {
  }
  line: Konva.Line = new Konva.Line();
  isDrawing = false;

  stop () {
    this.isDrawing = false
  }

  action (e: Konva.KonvaPointerEvent, stage: Konva.Stage | null, layer: Konva.Layer): void {
    // created canvas we can add to layer as "Konva.Image" element
    if (!this.isDrawing) {
      this.isDrawing = true
      this.line = new Konva.Line({
        stroke: this.colour,
        strokeWidth: Number(this.size),
        lineJoin: 'bevel',
        globalCompositeOperation: 'source-over',
        points: [e.evt.x, e.evt.y],
        bezier: true,
        lineCap: 'round'
      })
      layer.add(this.line)
    } else {
      const newPoints = this.line.points().concat([e.evt.x, e.evt.y])
      this.line.points(newPoints)
      layer.batchDraw()
    }
  }
}
