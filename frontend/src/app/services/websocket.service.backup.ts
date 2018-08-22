import { Injectable } from '@angular/core';
import * as msgpack from 'msgpack-lite';
import { MSG_TYPE, EVENT_TYPE } from '../../../../common/protocol/msg_types';
import { XBaseMsg, XResponse, XEvent, XRequest } from '../../../../common/protocol/generic';
import { EventHandlerService } from './eventhandler.service';
import { EventEmitter } from 'events';

export class EventSubscription {
  client_id: number;
  constructor(public event_type: EVENT_TYPE) {
    this.client_id = Math.floor(Math.random() * 1_000_000);
  }
}

/**
 * This service is used for communication with server through websocket.
 * It is supposed to be a single instance injected in the main app component,
 * and use everywhere where necessary.
 */
@Injectable()
export class WebsocketClientService {

  private wsurl: string;
  private ws: WebSocket;
  // when client sends a msg and awaits for response, he will subscribe for this response on
  // this bus
  private rpcBus: EventEmitter;
  // websocket lifecycle listeners
  private onOpenListeners: ((number) => void)[];
  private onCloseListeners: ((number) => void)[];

  constructor(public eventHandler: EventHandlerService) {
    this.wsurl = 'ws://localhost:8999';
    this.ws = undefined;
    this.onOpenListeners = [];
    this.onCloseListeners = [];
  }

  connect() {
    if (this.isConnected() === true) {
      return;
    }
    this.ws = new WebSocket(this.wsurl);
    this.ws.binaryType = 'arraybuffer'; // necessary!
    this.ws.onmessage = (ev: MessageEvent) => {
      // TODO: (de)serializer as injectable service, two impls: JSON and MSGPACK
      // const baseMsg = JSON.parse(ev.data) as BaseMsg; // JSON string
      const baseMsg = msgpack.decode(new Uint8Array(ev.data)) as XBaseMsg; // MsgPack
      switch (baseMsg.type) {
        case MSG_TYPE.RESPONSE: {
          // this.handleResponse
          const response = baseMsg as XResponse;
          console.log(response);
          this.rpcBus.emit(response.id.toString(), response);
        } break;
        case MSG_TYPE.EVENT: {
          // this.handleEvent
          this.eventHandler.handle(baseMsg as XEvent);
        } break;
      }
    };
    // assign lambdas calling all registered lifecycle listeners
    this.ws.onopen = (ev: Event) => this.onOpenListeners.forEach(listener => listener(this.ws.readyState));
    this.ws.onclose = (ev: CloseEvent) => this.onCloseListeners.forEach(listener => listener(0));
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
   * Lifecycle listeners
   * argument of lambda is value of WebSocket.readyState
   * // TODO: unsubscribe
   * @param onOpenListener
   */
  registerOnOpenListener(onOpenListener: (number) => void) {
    this.onOpenListeners.push(onOpenListener);
  }
  registerOnCloseListener(onCloseListener: (number) => void) {
    this.onCloseListeners.push(onCloseListener);
  }

  /**
   * This is one-way sending or RPC-style call.
   * @param req - request
   * @param onResponseListener - called when response arrives
   * @param onSentListener - called right after sending message
   */
  call
    <T extends XRequest<K>, K extends XResponse>
    (
      req: T,
      onResponseListener?: (response: K) => any,
      onSentListener?: () => any,
    ): void {
    // send request through websocket
    // this.ws.send( JSON.stringify(msg)); // JSON string
    this.ws.send(msgpack.encode(req)); // MsgPack
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
   *
   * @param ev
   * @param onSentListener
   */
  send( ev: XBaseMsg, onSentListener?: () => any ) {
    this.ws.send(msgpack.encode(ev)); // MsgPack
    if (onSentListener !== undefined) {
      onSentListener();
    }
  }

}
