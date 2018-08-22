import { Injectable } from '@angular/core';
import * as msgpack from 'msgpack-lite';
import { MSG_TYPE, EVENT_TYPE } from '../../../../common/protocol/msg_types';
import { XBaseMsg, XResponse, XEvent } from '../../../../common/protocol/generic';
import { EventHandlerService } from './eventhandler.service';
import { WebsocketConnService } from './websocketconn.service.';
import { RemoteProcCallService } from './remoteproccall.service';

export class EventSubscription {
  client_id: number;
  constructor(public event_type: EVENT_TYPE) {
    this.client_id = Math.floor(Math.random() * 1_000_000);
  }
}

/**
 * Normally it would be part of WebsocketConnService, but thenn there was cyclic dependency
 * between WebsocketConnService and RemoteProcCallService (first one called .handle() on
 * the second one and the second one called .send() on the first one)
 * It is supposed to be a single instance injected in the main app component,
 * and use everywhere where necessary.
 */
@Injectable()
export class WebsocketSetup {

  constructor(public ws: WebsocketConnService,
    public eventHandler: EventHandlerService,
    public rpc: RemoteProcCallService) {
    this.ws.setOnMessage(
      (ev: MessageEvent) => {
        // TODO: (de)serializer as injectable service, two impls: JSON and MSGPACK
        // const baseMsg = JSON.parse(ev.data) as BaseMsg; // JSON string
        const baseMsg = msgpack.decode(new Uint8Array(ev.data)) as XBaseMsg; // MsgPack
        switch (baseMsg.type) {
          case MSG_TYPE.RESPONSE: {
            this.rpc.handle(baseMsg as XResponse);
          } break;
          case MSG_TYPE.EVENT: {
            this.eventHandler.handle(baseMsg as XEvent);
          } break;
        }
      }
    );
  }

}
