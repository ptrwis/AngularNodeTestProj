import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import * as msgpack from 'msgpack-lite';
import { MSG_TYPE, EVENT_TYPE } from '../../../../common/protocol/msg_types';
import { XBaseMsg, XRequest, XResponse, XEvent } from '../../../../common/protocol/generic';
import { EventHandler } from './eventhandler.service';
import { RemoteProcCall } from './remoteproccall.service';

export class EventSubscription {
  client_id: number;
  constructor( public event_type: EVENT_TYPE ) {
    this.client_id = Math.floor( Math.random() * 1_000_000 );
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
  // websocket lifecycle listeners
  private onOpenListeners: ((readyState: number) => void)[];
  private onCloseListeners: ((readyState: number) => void)[];

  constructor( public eventHandler: EventHandler,
               public rpc: RemoteProcCall ) {
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
      switch ( baseMsg.type ) {
        case MSG_TYPE.RESPONSE: this.rpc.handle( baseMsg as XResponse);         break;
        case MSG_TYPE.EVENT:    this.eventHandler.handle( baseMsg as XEvent );  break;
      }
    };
    // call registered lifecycle listeners
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
   * // TODO: unsubscribe
   * @param onOpenListener
   */
  registerOnOpenListener(onOpenListener: (readyState: number) => void) {
    this.onOpenListeners.push( onOpenListener );
  }
  registerOnCloseListener(onCloseListener: (readyState: number) => void) {
    this.onCloseListeners.push( onCloseListener );
  }

  async send(msg: XBaseMsg) {
    // this.ws.send( JSON.stringify(msg)); // JSON string
    this.ws.send(msgpack.encode(msg)); // MsgPack
    console.log(msg);
  }

}
