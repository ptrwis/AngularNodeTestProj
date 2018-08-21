import { Injectable } from '@angular/core';
import * as msgpack from 'msgpack-lite';
import { MSG_TYPE, EVENT_TYPE } from '../../../../common/protocol/msg_types';
import { XBaseMsg, XResponse, XEvent, XRequest } from '../../../../common/protocol/generic';
import { EventHandler } from './eventhandler.service';
import { EventEmitter } from 'events';
import { MyWebsocket } from './mywebsocket';

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
export class WebsocketSetup {

  constructor(public ws: MyWebsocket) {
    this.ws.setOnMessage(
      (ev: MessageEvent) => {
        // TODO: (de)serializer as injectable service, two impls: JSON and MSGPACK
        // const baseMsg = JSON.parse(ev.data) as BaseMsg; // JSON string
        const baseMsg = msgpack.decode(new Uint8Array(ev.data)) as XBaseMsg; // MsgPack
        switch (baseMsg.type) {
          case MSG_TYPE.RESPONSE: {
            const response = baseMsg as XResponse;
            console.log(response);
            this.rpcBus.emit(response.id.toString(), response);
            // this.rpc.handle(baseMsg as XResponse);
          } break;
          case MSG_TYPE.EVENT: {
            this.eventHandler.handle(baseMsg as XEvent);
          } break;
        }
      }
    );
  }

}
