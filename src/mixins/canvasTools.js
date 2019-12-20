import Konva from 'konva'

export const canvasTools = {
  methods: {
    ping () {
      return {
        onClick (e, layer) {
          const amplitude = 25
          const period = 500
          const item = new Konva.Circle({
            x: e.evt.x,
            y: e.evt.y,
            radius: 0,
            stroke: 'red',
            strokeWidth: 5
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
    }
  }
}
