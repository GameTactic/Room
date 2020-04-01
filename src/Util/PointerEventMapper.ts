export default class PointerEventMapper {
  static touchEventMapper = (event: TouchEvent): object => {
    const e = event as unknown as CustomTouchEvent
    const touches = e.evt.changedTouches
    const first = touches[0]
    let type = ''
    switch (event.type) {
      case 'touchstart': type = 'mousedown'; break
      case 'touchmove': type = 'mousemove'; break
      case 'touchend': type = 'mouseup'; break
    }
    const simulatedEvent = document.createEvent('MouseEvent')
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
      first.screenX, first.screenY,
      first.clientX, first.clientY, false,
      false, false, false, 0, null)
    first.target.dispatchEvent(simulatedEvent)
    return {
      evt: simulatedEvent as PointerEvent,
      target: e.target,
      currentTarget: e.currentTarget,
      pointerId: e.pointerId,
      type: event.type
    }
  }
}

export interface CustomTouchEvent extends TouchEvent {
  evt: TouchEvent;
  pointerId: number;
}
