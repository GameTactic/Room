import Konva from 'konva'
import { CanvasElementType, Point } from '@/types/canvas'
import Shape, { PingCreatorInterface } from '@/tools/shapes/shape'

export default class PingCreator extends Shape implements PingCreatorInterface {
  private readonly amplitude = 25
  private readonly period = 500
  private ping: Konva.Circle
  constructor (public temporary: boolean,
               public size: number,
               public colour: string,
               public groupId: string,
               public point: Point) {
    super()
    this.ping = new Konva.Circle()
  }

  create = (): void => {
    this.group.id(this.groupId).add(
      this.ping = this.createElement()
    )
    this.group.attrs.type = CanvasElementType.SHAPE
    this.group.attrs.temporary = this.temporary
    this.layer.add(this.group)
    this.runAnimation(this.ping)
  }

  createElement = (): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      x: this.point.x,
      y: this.point.y,
      radius: 0,
      stroke: this.colour,
      strokeWidth: this.size
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
