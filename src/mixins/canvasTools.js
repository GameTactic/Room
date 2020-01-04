import Konva from 'konva'

export const canvasTools = {
  methods: {
    ping () {
      return {
        onClick (e, stage, layer, tool) {
          const amplitude = 25
          const period = 500
          const item = new Konva.Circle({
            x: e.evt.x,
            y: e.evt.y,
            radius: 0,
            stroke: tool.colour,
            strokeWidth: tool.size
          })
          layer.add(item)
          const anim = new Konva.Animation((frame) => {
            item.radius(amplitude * Math.sin((frame.time * Math.PI) / 1000))
            item.opacity(1.8 - (frame.time * Math.PI) / 1000)
          }, layer)
          anim.start()
          setTimeout(() => {
            item.destroy()
            anim.stop()
            layer.batchDraw()
          }, period)
        }
      }
    },
    freedraw () {
      return {
        onClick (e, stage, layer, tool) {
          // created canvas we can add to layer as "Konva.Image" element
          const line = new Konva.Line({
            stroke: tool.colour,
            strokeWidth: Number(tool.size),
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
    }
  }
}
