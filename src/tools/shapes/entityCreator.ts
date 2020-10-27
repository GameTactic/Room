import Konva from 'konva'
import { CanvasElementType, Point, CanvasElementSubType } from '@/types/canvas'
import Shape from '@/tools/shapes/shape'
import { Dimensions } from '@/mixins/stageWatcher'

export default class EntityCreator extends Shape {
  private readonly hitStroke: number = 10
  private textGroup: Konva.Group = new Konva.Group()
  private imageGroup: Konva.Group = new Konva.Group()
  constructor (public temporary: boolean,
               public image: string,
               public point: Point,
               public dimensions: Dimensions,
               public name: string,
               public title: string,
               public groupId: string,
               public color?: string
  ) {
    super()
  }

  create = (): void => {
    this.group = new Konva.Group()
    this.group.id(this.groupId)
    this.textGroup.id(this.groupId)
    this.imageGroup.id(this.groupId)
    this.createElement()
  }

  createElement = (): void => {
    Konva.Image.fromURL(this.image, (image: Konva.Image) => {
      image.setAttrs({
        x: this.point.x - (this.dimensions.width / 2),
        y: this.point.y - (this.dimensions.height / 2),
        width: this.dimensions.width,
        height: this.dimensions.height,
        hitStroke: this.hitStroke
      })
      if (this.color) {
        image.cache()
        image.filters([Konva.Filters.RGB])
        image.red(this.hexToRgb(this.color)?.r ?? 0)
        image.green(this.hexToRgb(this.color)?.g ?? 0)
        image.blue(this.hexToRgb(this.color)?.b ?? 0)
      }
      const name: Konva.Text = new Konva.Text({
        x: this.point.x - (this.dimensions.width / 2),
        y: this.point.y + this.dimensions.height,
        text: this.name,
        fontSize: 20,
        fontFamily: 'Calibri',
        fill: 'white'
      })
      name.transformsEnabled('position')

      this.textGroup.add(name)
      this.imageGroup.add(image)
      this.group.add(this.textGroup)
      this.group.add(this.imageGroup)
      this.imageGroup.attrs.type = CanvasElementType.ENTITY
      this.textGroup.attrs.type = CanvasElementSubType.TEXT
      this.imageGroup.attrs.temporary = this.temporary
      this.layer.add(this.group)
      this.group.draw()
    })
  }

  hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, (m: string, r: string, g: string, b: string) => r + r + g + g + b + b)
    const result: RegExpExecArray | null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
}
