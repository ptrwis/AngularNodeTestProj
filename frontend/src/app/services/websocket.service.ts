import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { BaseMsg, PeerToServer, ServerToPeer, MSG_TYPE, RpcRespMsg, RpcReqMsg } from './../../../../common/protocol';

@Injectable()
export class WebsocketService {

    rpcBus: EventEmitter = new EventEmitter();
    private ws: WebSocket;

    connect() {
        if ( this.ws === undefined ) {
          this.ws = new WebSocket('ws://localhost:8999');
          this.ws.onmessage = (ev: MessageEvent) => {
            const baseMsg = JSON.parse(ev.data) as ServerToPeer;
            switch (baseMsg.type) {
              case MSG_TYPE.RPC_RESP:
                const rpcRespMsg = baseMsg as RpcRespMsg;
                this.rpcBus.emit( rpcRespMsg.msgid.toString(), rpcRespMsg);
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

    async send( msg: PeerToServer) {
      this.ws.send( JSON.stringify(msg));
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
     * Req i Resp to tyby generyczne dziedziczace odpowiednio po RpcReqMsg i RpcRespMsg.
     * @param req - obiekt z requestem wysylanym do serwera
     * @param listener - funkcja ktora sie wykona po przyjsciu odpowiedzi, jako argument dostaje wlasnie odpowiedz
     */
    call<Req extends RpcReqMsg, Resp extends RpcRespMsg>(req: Req, listener: (response: Resp) => void ): void {
      this.send( req);
      // subscribe on queue for response with the same msg id, as req.id
      this.rpcBus.on( req.id.toString(), listener);
    }

}
