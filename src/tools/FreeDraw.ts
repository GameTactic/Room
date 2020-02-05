import { Tool } from '@/tools/Tool'
import Konva from 'konva'

export default class FreeDraw implements Tool {
  // eslint-disable-next-line no-useless-constructor
  constructor (public readonly name: string,
               public size: number,
               public colour: string) {
  }

  action (e: Konva.KonvaPointerEvent, stage: Konva.Stage | null, layer: Konva.Layer): void {
    // created canvas we can add to layer as "Konva.Image" element
    const line = new Konva.Line({
      stroke: this.colour,
      strokeWidth: Number(this.size),
      lineJoin: 'round',
      globalCompositeOperation: 'source-over',
      points: [e.evt.x, e.evt.y]
    })
    layer.add(line)

    const newPoints = line.points().concat([e.evt.x + 3, e.evt.y + 3])
    line.points(newPoints)

    layer.batchDraw()

    // // Now we need to get access to context element
    // const context = canvas.getContext('2d')
    // context.strokeStyle = tool.colour
    // context.lineJoin = 'round'
    // context.lineWidth = tool.size

    // let pointerPosition = stage.getPointerPosition()
    // context.globalCompositeOperation = 'source-over'
    // context.beginPath()

    // const localPosition = {
    //   x: pointerPosition.x,
    //   y: pointerPosition.y
    // }

    // context.lineTo(e.evt.x, e.evt.y)
    // // context.closePath()
    // context.stroke()
    // layer.batchDraw()
  }
}
