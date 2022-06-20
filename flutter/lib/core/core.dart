import 'dart:async';

import 'package:event_bus/event_bus.dart';

import 'events_data.dart';

/**
 * Core 클래스들의 Super class
 */
class Core {

  /**
   * EventBus 구독 신청
   * @param event 이벤트가 발생했을 때 실행할 이벤트 핸들러
   * @return 구독 신청한 핸들
   */
  Object subscribeEvent(void event(EventData event)) {
    return _eventBus.on<EventData>().listen(event);
  }

  /**
   * EventBus 구독 취소
   * @param object 구독 신청한 핸들
   */
  void unsubscribeEvent(Object object) {
    (object as StreamSubscription).cancel();
  }

  /**
   * 이벤트를 발생시킨다.
   * @param event 이벤트 내용
   */
  void fireEvent(EventData event) {
    _eventBus.fire(event);
  }

  void fireCode(String code) {
    _eventBus.fire(EventData(code, <String, dynamic>{}));
  }

  EventBus _eventBus = EventBus();
}