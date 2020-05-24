import Konva from 'konva'
import { CanvasElement, CanvasElementType } from '@/types/Canvas'
import Shape from '@/tools/shapes/Shape'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'
import { EntityData } from '@/tools/Tool'

export default class EntityCreator extends Shape {
  private sprite: Konva.Sprite
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean) {
    super()
    this.sprite = new Konva.Sprite({})
  }

  create = (event: CustomEvent | CustomStageEvent, canvasElement: CanvasElement): void => {
    this.group = new Konva.Group()
    this.group.id(canvasElement.id)
    this.createSpriteElement(canvasElement, event)
  }

  createSpriteElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent): void => {
    const data = canvasElement.data as EntityData
    Konva.Image.fromURL(data.entity.image, (image: Konva.Image) => {
      image.setAttrs({
        x: this.formatX(data.point.x, event),
        y: this.formatY(data.point.y, event),
        width: data.dimensions.width,
        height: data.dimensions.height,
        hitStroke: this.hitStroke
      })
      this.group.add(image)
      this.group.attrs.type = CanvasElementType.ENTITY
      this.layer.add(this.group)
      this.group.draw()
    })
  }
}
