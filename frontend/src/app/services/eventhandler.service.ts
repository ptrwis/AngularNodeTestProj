import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { EVENT_TYPE } from '../../../../common/protocol/msg_types';
import { XEvent } from '../../../../common/protocol/generic';

/**
 * In thery we can have multiple clients (like multiple views)
 * subscribed on single event. TODO: rly?
 */

export class EventSubscription {
    id: number;
    constructor( public event_type: EVENT_TYPE ) {
      this.id = Math.floor( Math.random() * 1_000_000 );
    }
    /**
     * TODO: this sucks
     */
    eventTypeStr() {
        return this.event_type.valueOf().toString();
    }
  }

/**
* Handling messages on WebSocket level is implemented in WebsocketClientService
* usage:
* sub1 = eventHandler.subscribeOnMessage( CHAT_MSG, (msg: ChatMsg) => console.log(msg.msg) );
* sub2 = eventHandler.subscribeOnMessage( CHAT_MSG, (msg: ChatMsg) => console.log(msg.msg) );
* eventHandler.unsubscribeFromMessage(sub2);
* eventHandler.unsubscribeFromMessage(sub1);
*/
@Injectable()
export class EventHandler {

    private eventBus: EventEmitter;
    private subscribers: Map< number, ( event: XEvent ) => void >;

  /**
   * Subscription to particular event.
   * Clients' listeners are registered in this.subscribers and the key os EventSubscription.client_id (random int).
   * Listeners on EventEmmiter must be registered with string key, and it is EVENT_TYPE's string value
   * typename must correspond to T
   * @param listener
   */
  subscribeOnMessage<T extends XEvent>(
      event_type: EVENT_TYPE,
      listener: ( event: T ) => void
    ): EventSubscription {
        const sub = new EventSubscription(event_type);
        this.eventBus.on( sub.eventTypeStr(), listener);
        this.subscribers.set(sub.id, listener);
        return sub;
  }

  /**
   *
   * @param key value returned from subscribeOnMessage(...)
   */
  unsubscribeFromMessage( sub: EventSubscription ) {
    this.eventBus.removeListener(
        sub.eventTypeStr(),
        this.subscribers.get(sub.id)
    );
    this.subscribers.delete(sub.id);
  }

  /**
   *
   * @param msg
   */
  handle( msg: XEvent ) {
    console.log( msg );
    this.eventBus.emit(msg.event_type.valueOf().toString(), msg);
  }

}
