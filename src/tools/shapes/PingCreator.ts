import Konva from 'konva'
import { CanvasElement, CanvasElementType } from '@/types/Canvas'
import Shape, { PingCreatorInterface } from '@/tools/shapes/Shape'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'
import { PingData } from '@/tools/Tool'

export default class PingCreator extends Shape implements PingCreatorInterface {
  private readonly amplitude = 25
  private readonly period = 500
  private ping: Konva.Circle
  constructor (public temporary: boolean,
               public size: number,
               public colour: string) {
    super()
    this.ping = new Konva.Circle()
  }

  create = (event: CustomEvent | CustomStageEvent, canvasElement?: CanvasElement): void => {
    if (!canvasElement) { canvasElement = this.canvasElement }
    this.group.id(canvasElement.id).add(
      this.ping = this.createPingElement(canvasElement, event)
    )
    this.group.attrs.type = CanvasElementType.SHAPE
    this.layer.add(this.group)
    this.runAnimation(this.ping)
  }

  createPingElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, colour?: string, size?: number): Konva.Shape & Konva.Circle => {
    const data = canvasElement.data as PingData
    return new Konva.Circle({
      x: this.formatX(data.point.x, event),
      y: this.formatY(data.point.y, event),
      radius: 0,
      stroke: colour || this.colour,
      strokeWidth: size || this.size
    })
  }

  runAnimation = (ping: Konva.Circle): void => {
    const animate = new Konva.Animation((frame) => {
      if (frame) {
        ping.radius(this.amplitude * (frame.time / this.period))
        ping.opacity(1.8 - (frame.time * Math.PI) / 1000)
      }
    }, this.layer)
    animate.start()
    setTimeout(() => {
      ping.destroy()
      animate.stop()
      this.layer.batchDraw()
    }, this.period)
  }
}
