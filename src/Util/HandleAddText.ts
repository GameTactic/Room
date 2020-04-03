import { CanvasElement } from '@/types/Canvas'
import Konva from 'konva'

export default class HandleAddText {
  // eslint-disable-next-line no-useless-constructor
  constructor (public canvasElement: CanvasElement,
               public layer: Konva.Layer,
               public socket: WebSocket,
               public canvasElements: CanvasElement[]) {
  }

  handle = (): boolean => {
    if (this.canvasElement.tool.textString && this.canvasElement.tool.textString?.length > 0) {
      const foundNode: Konva.Collection<Konva.Group> = this.layer.find((group: Konva.Group) => group.attrs.id === this.canvasElement.id)
      const foundElement = this.canvasElements.find((element: CanvasElement) => element.id === this.canvasElement.id)
      if (foundElement && foundNode) {
        const group: Konva.Group | undefined = foundNode.toArray().find((group: Konva.Group) => group.attrs.id === this.canvasElement.id)
        const textElement: Konva.Text | undefined = group?.findOne<Konva.Text>((node: Konva.Text) => node)
        if (textElement) {
          textElement.text(this.canvasElement.tool.textString)
          if (textElement.getTextWidth() > (this.layer.getWidth() - textElement.getAbsolutePosition().x)) {
            textElement.width(this.layer.getWidth() - textElement.getAbsolutePosition().x)
          }
          foundElement.tool.textString = this.canvasElement.tool.textString
          this.layer.batchDraw()
          this.socket.send(JSON.stringify(this.canvasElement))
          return true
        }
      }
    } else {
      return false
    }
    return false
  }
}
