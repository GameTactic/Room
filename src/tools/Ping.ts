import { Tool } from '@/tools/Tool'
import Konva from 'konva'

export default class Ping implements Tool {
  // eslint-disable-next-line no-useless-constructor
  constructor (public readonly name: string,
               public readonly size: number,
               public readonly colour: string) {
  }
  isDrawing = false;
  stop () {
    this.isDrawing = false
  }

  action = (e: Konva.KonvaPointerEvent, stage: Konva.Stage | null, layer: Konva.Layer): void => {
    this.isDrawing = true
    const amplitude = 25
    const period = 500
    const item = new Konva.Circle({
      x: e.evt.x,
      y: e.evt.y,
      radius: 0,
      stroke: this.colour,
      strokeWidth: this.size
    })
    layer.add(item)
    const anim = new Konva.Animation((frame) => {
      if (frame) {
        item.radius(amplitude * Math.sin((frame.time * Math.PI) / 1000))
        item.opacity(1.8 - (frame.time * Math.PI) / 1000)
      }
    }, layer)
    anim.start()
    setTimeout(() => {
      item.destroy()
      anim.stop()
      layer.batchDraw()
    }, period)
  }
}
