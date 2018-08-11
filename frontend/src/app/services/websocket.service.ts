import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import * as msgpack from 'msgpack-lite';
import { MSG_TYPE, EVENT_TYPE } from '../../../../common/protocol/msg_types';
import { XBaseMsg, XRequest, XResponse, VoidResponse, XEvent } from '../../../../common/protocol/generic';
import { PeerJoinedTheRoomMsg } from '../../../../common/protocol/join_room';
import { LeaveTheRoomMsg, PeerLeftTheRoomMsg } from '../../../../common/protocol/leave_room';
import { RoomHasBeenCreated } from '../../../../common/protocol/create_room';

/**
 * This service is used for communication with server through websocket.
 * It is supposed to be a single instance injected in the main app component,
 * and use everywhere where necessary
 */
@Injectable()
export class WebsocketClientService {

  wsurl: string;
  rpcBus: EventEmitter = new EventEmitter();
  private ws: WebSocket;
  onOpenListeners: ((readyState: number) => void)[];
  onCloseListeners: ((readyState: number) => void)[];

  /**
   * // TODO: this sucks
   * @param ev
   */
  static prefixEvent( ev: XEvent ) {
    return `_${ev.event_type}`;
  }

  constructor() {
    this.wsurl = 'ws://localhost:8999';
    this.ws = undefined;
    this.onOpenListeners = [];
    this.onCloseListeners = [];
  }

  connect() {
    if (this.isConnected() === true) {
      return;
    }
    this.ws = new WebSocket( this.wsurl );
    this.ws.binaryType = 'arraybuffer'; // necessary!
    this.ws.onmessage = (ev: MessageEvent) => {
      // TODO: (de)serializer as injectable service, two impls: JSON and MSGPACK
      // const baseMsg = JSON.parse(ev.data) as BaseMsg; // JSON string
      const baseMsg = msgpack.decode(new Uint8Array(ev.data)) as XBaseMsg; // MsgPack
      // const baseMsg = msgpack.decode(new Uint8Array(ev.data)) as XEvent;
      switch ( baseMsg.type ) {
        case MSG_TYPE.RESPONSE:
          const response = baseMsg as XResponse;
          console.log( response );
          this.rpcBus.emit( response.id.toString(), baseMsg);
          break;
        // EVENTS:
        case MSG_TYPE.EVENT:
          const event = baseMsg as XEvent;
          console.log( event );
          const key = WebsocketClientService.prefixEvent( event );
          this.rpcBus.emit( key , event);
          break;
      }
    };
    // TODO: remove listeners, and when?
    this.ws.onopen = (ev: Event) => this.onOpenListeners.forEach( listener => listener(this.ws.readyState) );
    this.ws.onclose = (ev: CloseEvent) => this.onCloseListeners.forEach( listener => listener(0) );
  }

  disconnect() {
    // this.send( new RageQuit()); not here
    if (this.ws !== undefined) {
      this.ws.close();
      this.ws = undefined;
    }
  }

  isConnected() {
    return this.ws !== undefined && this.ws.readyState === 1;
  }

  /**
   * Lifecycle listeners
   * @param onOpenListener
   */
  registerOnOpenListener(onOpenListener: (readyState: number) => void) {
    this.onOpenListeners.push( onOpenListener );
  }
  registerOnCloseListener(onCloseListener: (readyState: number) => void) {
    this.onCloseListeners.push( onCloseListener );
  }

  /**
   * subscription to particular event
   * typename must correspond to  T
   * @param listener
   */
  subscribeOnMessage<T extends XEvent>( typename: string,  listener: ( event: T ) => void ) {
    this.rpcBus.on( typename, listener);
  }

  async send(msg: XBaseMsg) {
    // this.ws.send( JSON.stringify(msg)); // JSON string
    this.ws.send(msgpack.encode(msg)); // MsgPack
    console.log(msg);
  }

  /**
   * Maybe this will work in future Typescript
   * For now, if response is of type VoidResponse (so there is no reponse),
   * caller should not pass any listener.
   */
  call
    <T extends XRequest<K>, K extends XResponse>
  (
    req: T,
    onResponseListener?: (response: K) => any,
    onSentListener?: () => any,
  ): void {
    // send request through websocket
    this.send(req);
    // callback called right after sending
    if ( onSentListener !== undefined ) {
      onSentListener();
    }
    // subscribe on queue for response with the same msg id as req.id
    // if ( K instanceof VoidResponse ) { return; }
    if ( onResponseListener !== undefined ) {
      this.rpcBus.on(req.id.toString(), onResponseListener);
    }
  }

}
