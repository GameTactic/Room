import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import Shape, { PingCreatorInterface } from '@/tools/shapes/Shape'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

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

  create = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    this.group.attrs.temporary = this.temporary
    this.group.id(canvasElement.id).add(
      this.ping = this.createPingElement(canvasElement, event)
    )
    layer.add(this.group)
    this.runAnimation(this.ping, layer)
  }

  createPingElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, colour?: string, size?: number): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      x: this.formatX(canvasElement.data[0], event),
      y: this.formatY(canvasElement.data[1], event),
      radius: 0,
      stroke: colour || this.colour,
      strokeWidth: size || this.size
    })
  }

  runAnimation = (ping: Konva.Circle, layer: Konva.Layer): void => {
    const animate = new Konva.Animation((frame) => {
      if (frame) {
        ping.radius(this.amplitude * (frame.time / this.period))
        ping.opacity(1.8 - (frame.time * Math.PI) / 1000)
      }
    }, layer)
    animate.start()
    setTimeout(() => {
      ping.destroy()
      animate.stop()
      layer.batchDraw()
    }, this.period)
  }
}
