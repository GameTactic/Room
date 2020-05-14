import Konva from 'konva'
import { NodeConfig } from 'konva/types/Node'
import { StageGetters } from '@/store/modules/stage'
import store from '@/main'

export default class PointerEventMapper {
  static touchEventMapper = (event: TouchEvent): object => {
    const e = event as CustomTouchEvent
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

  static mouseEventMapper = (event: MouseEvent): object => {
    return {
      evt: event as PointerEvent,
      target: event.target,
      currentTarget: event.currentTarget,
      pointerId: 0,
      type: event.type
    }
  }

  static globalEventMapper = (e: Konva.KonvaPointerEvent | DragEvent): CustomEvent => {
    const stageConfig: CustomStageConfig = store.getters[`stage/${StageGetters.STAGE_CONFIG}`]
    const stageZoom: number = store.getters[`stage/${StageGetters.STAGE_ZOOM}`]
    const stage: Konva.Stage = store.getters[`stage/${StageGetters.STAGE}`]
    let pageX = 0
    let pageY = 0
    if ('evt' in e) {
      pageX = e.evt.pageX
      pageY = e.evt.pageY
    } else {
      pageX = e.pageX
      pageY = e.pageY
    }
    const offset = {
      x: pageX - stage.attrs.container.offsetLeft,
      y: pageY - stage.attrs.container.offsetTop
    }
    const globalOffsetPercentage = {
      x: (offset.x / (stageZoom / 100)) / (stage.width() / (stageZoom / 100)),
      y: (offset.y / (stageZoom / 100)) / (stage.height() / (stageZoom / 100))
    }
    let globalOffset: Point = {
      x: 0,
      y: 0
    }
    if (stageConfig.width && stageConfig.height) {
      globalOffset = {
        x: globalOffsetPercentage.x * stageConfig.initialWidth,
        y: globalOffsetPercentage.y * stageConfig.initialHeight
      }
    }
    return {
      offset: offset,
      globalOffsetPercentage: globalOffsetPercentage,
      globalOffset: globalOffset,
      pointerEvent: (e as Konva.KonvaPointerEvent).evt || e,
      stageConfig: stageConfig,
      zoom: stageZoom,
      stage: stage,
      konvaPointerEvent: (e as Konva.KonvaPointerEvent)
    }
  }
}

export interface CustomEvent {
  offset: Point;
  globalOffsetPercentage: Point;
  globalOffset: Point;
  pointerEvent: PointerEvent;
  stageConfig: CustomStageConfig;
  zoom: number;
  stage: Konva.Stage;
  konvaPointerEvent: Konva.KonvaPointerEvent;
}

export interface Point {
  x: number;
  y: number;
}

export interface CustomStageConfig extends NodeConfig {
  scale: Point;
  width: number;
  height: number;
  initialWidth: number;
  initialHeight: number;
  mapSrc: string;
  mapRatio: number;
}

export interface CustomStageEvent {
  stageConfig: CustomStageConfig;
  zoom: number;
  stage: Konva.Stage;
}

export interface CustomTouchEvent extends TouchEvent {
  evt: TouchEvent;
  pointerId: number;
}
