import { Injectable } from '@angular/core';
import * as msgpack from 'msgpack-lite';
import { MSG_TYPE, EVENT_TYPE } from '../../../../common/protocol/msg_types';
import { XBaseMsg, XResponse, XEvent, XRequest, XCmd } from '../../../../common/protocol/generic';
import { EventEmitter } from 'events';

/**
 * We store event_type and listener because these two things are
 * necessary when unsubscribing from EventEmmiter (event_type is the key).
 */
export class EventSubscription {
  constructor(public event_type: EVENT_TYPE,
              public listener: (XEvent) => void) {
  }
}

/**
 * This service allows to:
 * - send message and not await for response
 * - send message and await for response (RPC)
 * - handle incoming messages (events) which are not a response to requests
 * This service is used for communication with server through websocket,
 * and should be used as singleton (but it's not)- just inject it into root
 * component.
 */
@Injectable()
export class WebsocketService {

  private url: string;
  private ws: WebSocket;
  // those two are explained further
  private eventBus: EventEmitter;
  private rpcBus: EventEmitter;

  constructor() {
    this.url = 'ws://localhost:8999';
    this.ws = undefined;
    this.eventBus = new EventEmitter();
    this.rpcBus = new EventEmitter();
  }

  /**
   * Websocket API doesn't have 'connect' method, so we emulate it
   * by just creating new Websocket and reassigning all parameters.
   * TODO: we cam fall back to registering onOpen/onClose listeners,
   * eventually throwing exception if connection is already
   * opened / closed.
   * @param onOpenCallback
   * @param onCloseCallback
   */
  connect(
    onOpenCallback: () => void,
    onCloseCallback: (ev: CloseEvent) => void
  ) {
    if (this.isConnected() === true) {
      return;
    }
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = 'arraybuffer'; // necessary!
    this.ws.onopen = onOpenCallback;
    this.ws.onclose = onCloseCallback;
    // incoming message handling!
    this.ws.onmessage = (ev: MessageEvent) => {
      // TODO: (de)serializer as injectable service, two impls: JSON and MSGPACK
      // const baseMsg = JSON.parse(ev.data) as BaseMsg; // JSON string
      const baseMsg = msgpack.decode(new Uint8Array(ev.data)) as XBaseMsg; // MsgPack
      switch (baseMsg.type) {
        case MSG_TYPE.RESPONSE: {
          const response = baseMsg as XResponse;
          console.log(response);
          this.rpcBus.emit(`${response.id}`, response);
        } break;
        case MSG_TYPE.EVENT: {
          const event = baseMsg as XEvent;
          console.log(event);
          // This will be handled by listener set in this.subscribeOnMessage()
          this.eventBus.emit(`${event.event_type}`, event);
        } break;
      }
    };
  }

  disconnect() {
    // this.send( new RageQuit()); not here
    if (this.isConnected()) {
      this.ws.close();
      this.ws = undefined;
    }
  }

  isConnected() {
    return this.ws !== undefined && this.ws.readyState === 1;
  }

  /**
   * Encode message (json, msgpack, ...) and send.
   * This is internal, private method used by others.
   * @param ev
   * @param onSentListener
   * @returns value returned by onSentListener
   */
  private encodeAndSend(ev: XBaseMsg, onSentListener?: () => any) {
    this.ws.send(msgpack.encode(ev)); // MsgPack
    if (onSentListener !== undefined) {
      return onSentListener();
    }
  }

  /**
   * ============================
   *        one way sending
   * ============================
   * Send message (without response)
   * TODO: introduce type corresponding to 'message without response' ('orphan msg'?)
   * @param ev
   * @param onSentListener
   * @returns value returned by onSentListener
   */
  send(ev: XCmd, onSentListener?: () => any) {
    return this.encodeAndSend(ev, onSentListener);
  }

  /**
   * ============================
   *    remote procedure call
   * ============================
   * This is RPC-style call (send request and await for response).
   * It doesn't work in Typescript (yet), but this structure of method
   * should allow developer to create a protocol- a pair of Request and
   * corresponding Response. This way without being explicit compiler
   * should figure out what is the type of response basing on the type
   * of request.
   * @param req - request
   * @param onResponseListener - called when response arrives
   * @param onSentListener - called right after sending message
   */
  call
    <T extends XRequest<K>, K extends XResponse>
    (
      req: T,
      onResponseListener: (response: K) => any,
      onSentListener?: () => any,
    ): void {
    // send request through websocket
    // this.ws.send( JSON.stringify(msg)); // JSON string
    this.ws.send( msgpack.encode(req) ); // MsgPack
    console.log(req);

    // callback called right after sending
    if (onSentListener !== undefined) {
      onSentListener();
    }

    // subscribe on queue for response with the same msg id as req.id
    // TODO: if ( K instanceof VoidResponse ) { return; } // but in case of VoidResponse caller shouldn't provide listener
    if (onResponseListener !== undefined) {
      this.rpcBus.on(req.id.toString(), onResponseListener);
    }
  }


  /**
   * =========================
   *    handling  events
   * =========================
   */

  /**
   * Subscribe to particular event.
   * unsubscribeFromMessage() to unsubscribe
   * @param event_type
   * @param listener
   */
  subscribeOnMessage<T extends XEvent>(
    event_type: EVENT_TYPE,
    listener: (T) => void
  ): EventSubscription {
    // idk how to get T.event_type,
    const sub = new EventSubscription(event_type, listener);
    this.eventBus.on(`${sub.event_type}`, sub.listener);
    return sub;
  }

  /**
   * Unsubscribe from particular event.
   * subscribeOnMessage() to subscribe
   * @param sub value returned from subscribeOnMessage(...)
   */
  unsubscribeFromMessage(sub: EventSubscription) {
    this.eventBus.removeListener(`${sub.event_type}`, sub.listener);
  }

}
