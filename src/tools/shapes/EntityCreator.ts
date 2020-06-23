import Konva from 'konva'
import { CanvasElementType, Point } from '@/types/Canvas'
import Shape from '@/tools/shapes/Shape'
import { Dimensions } from '@/mixins/StageWatcher'

export default class EntityCreator extends Shape {
  private sprite: Konva.Sprite
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public image: string,
               public point: Point,
               public dimensions: Dimensions,
               public name: string,
               public groupId: string,
               public color?: string
  ) {
    super()
    this.sprite = new Konva.Sprite({})
  }

  create = (): void => {
    this.group = new Konva.Group()
    this.group.id(this.groupId)
    this.createSpriteElement()
  }

  createSpriteElement = (): void => {
    Konva.Image.fromURL(this.image, (image: Konva.Image) => {
      image.setAttrs({
        x: this.point.x - (this.dimensions.width / 2),
        y: this.point.y - (this.dimensions.height / 2),
        width: this.dimensions.width,
        height: this.dimensions.height,
        hitStroke: this.hitStroke
      })
      this.group.add(image)
      this.group.attrs.type = CanvasElementType.ENTITY
      this.group.attrs.temporary = this.temporary
      this.layer.add(this.group)
      this.group.draw()
    })
  }
}
