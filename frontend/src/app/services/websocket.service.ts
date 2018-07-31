import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import * as msgpack from 'msgpack-lite';
import { MSG_TYPE } from '../../../../common/protocol/msg_types';
import { BaseMsg } from '../../../../common/protocol/generic';

@Injectable()
export class WebsocketClientService {

    rpcBus: EventEmitter = new EventEmitter();
    private ws: WebSocket;

    connect() {
        if ( this.ws === undefined ) {
          this.ws = new WebSocket('ws://localhost:8999');
          this.ws.onmessage = (ev: MessageEvent) => {
            // const baseMsg = JSON.parse(ev.data) as BaseMsg; // JSON string
            const baseMsg = msgpack.decode( ev.data ) as BaseMsg; // MsgPack
            switch (baseMsg.type) {
              case MSG_TYPE.RESPONSE:
                this.rpcBus.emit( baseMsg.id.toString(), baseMsg);
              break;
            }
          };
          this.ws.onclose = (ev: CloseEvent) => {
            console.log(ev.reason);
          };
        }
    }

    disconnect() {
      // this.send( new RageQuit()); not here
      this.ws.close();
      this.ws = undefined;
    }

    async send( msg: BaseMsg) {
      // this.ws.send( JSON.stringify(msg)); // JSON string
      this.ws.send( msgpack.encode( msg ) ); // MsgPack
    }

    getState() {
        if ( this.ws === undefined ) {
            return 'undefined';
        }
        switch ( this.ws.readyState) {
            case 0: return  'CONNECTING.0';
            case 1: return  'OPEN.......1';
            case 2: return  'CLOSING....2';
            case 3: return  'CLOSED.....3';
        }
    }

    /**
     * TODO: In TypeScript 3.1:
     * < T extends RpcRequest<K>, K extends RpcResponse >
     * ( req: T, listener: (response: K) => void ): void {
     */
   call( req: BaseMsg, listener: (response: BaseMsg) => void ): void {
       this.send( req); // send request through websocket
       // subscribe on queue for response with the same msg id as req.id
       this.rpcBus.on( req.id.toString(), listener);
   }

}
