import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import * as msgpack from 'msgpack-lite';
import { MSG_TYPE } from '../../../../common/protocol/msg_types';
import { XBaseMsg, XRequest, XResponse, VoidResponse } from '../../../../common/protocol/generic';

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

  constructor( ) {
    this.wsurl = 'ws://localhost:8999';
    this.ws = undefined;
    this.onOpenListeners = [];
    this.onCloseListeners = [];
  }

  connect() {
    if (this.ws === undefined) {
      this.ws = new WebSocket( this.wsurl );
      this.ws.binaryType = 'arraybuffer'; // necessary!
      this.ws.onmessage = (ev: MessageEvent) => {
        // TODO: (de)serializer as injectable service, two impls: JSON and MSGPACK
        // const baseMsg = JSON.parse(ev.data) as BaseMsg; // JSON string
        const baseMsg = msgpack.decode(new Uint8Array(ev.data)) as XResponse; // MsgPack
        switch (baseMsg.type) {
          case MSG_TYPE.RESPONSE:
            this.rpcBus.emit(baseMsg.id.toString(), baseMsg);
            break;
        }
      };
      this.ws.onopen = ( ev: Event ) => this.onOpenListeners.forEach( listener => listener(this.ws.readyState) );
      this.ws.onclose = (ev: CloseEvent) => this.onCloseListeners.forEach( listener => listener(0) );
    }
  }

  disconnect() {
    // this.send( new RageQuit()); not here
    if ( this.ws !== undefined ) {
      this.ws.close();
      this.ws = undefined;
    }
  }

  registerOnOpenListener( onOpenListener: (readyState: number) => void ) {
    this.onOpenListeners.push( onOpenListener );
  }
  registerOnCloseListener( onCloseListener: (readyState: number) => void ) {
    this.onCloseListeners.push( onCloseListener );
  }

  async send(msg: XBaseMsg) {
    // this.ws.send( JSON.stringify(msg)); // JSON string
    this.ws.send(msgpack.encode(msg)); // MsgPack
  }

  /**
   * Maybe this will work in future Typescript
   * For now, if reponse is of type VoidResponse (so there is no reponse),
   * caller should not pass any listener.
   */
  call
    <T extends XRequest<K>, K extends XResponse>
    (req: T, listener?: (response: K) => void): void {
    this.send(req); // send request through websocket
    // subscribe on queue for response with the same msg id as req.id
    // if ( K instanceof VoidResponse ) { return; }
    if (listener !== undefined) {
      this.rpcBus.on(req.id.toString(), listener);
    }
  }

}
