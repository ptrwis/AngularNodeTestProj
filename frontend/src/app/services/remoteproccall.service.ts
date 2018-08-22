import { Injectable } from '@angular/core';
import { XResponse, XRequest } from '../../../../common/protocol/generic';
import { EventEmitter } from 'events';
import { WebsocketConnService } from './websocketconn.service.';

/**
 * This service is used for communication with server through websocket.
 * It is supposed to be a single instance injected in the main app component,
 * and use everywhere where necessary.
 */
@Injectable()
export class RemoteProcCallService {

  // when client sends a msg and awaits for response, he will subscribe for this response on
  // this bus
  private rpcBus: EventEmitter;

  constructor(public ws: WebsocketConnService) {
    this.rpcBus = new EventEmitter();
  }

  handle(response: XResponse) {
    this.rpcBus.emit(response.id.toString(), response);
  }

  /**
   * This is RPC-style call.
   * TODO: for sending without response we have WebsocketConnService
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
    this.ws.send(req); // MsgPack
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

}
