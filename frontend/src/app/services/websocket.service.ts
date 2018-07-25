import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { PeerToServer, ServerToPeer, MSG_TYPE, RpcRequest, RpcResponse, BaseMsg } from './../../../../common/protocol/protocol';
import { encode, decode } from 'msgpack-lite';

@Injectable()
export class WebsocketClientService {

    rpcBus: EventEmitter = new EventEmitter();
    private ws: WebSocket;

    connect() {
        if ( this.ws === undefined ) {
          this.ws = new WebSocket('ws://localhost:8999');
          this.ws.onmessage = (ev: MessageEvent) => {
            // const baseMsg = JSON.parse(ev.data) as BaseMsg;
            const baseMsg = decode( ev.data ) as BaseMsg;
            switch (baseMsg.type) {
              case MSG_TYPE.RESPONSE:
                // const rpcRespMsg = baseMsg as RpcResponse;
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

    async send( msg: PeerToServer) {
      // this.ws.send( JSON.stringify(msg));
      this.ws.send( encode( msg ) );
    }

    async xsend<J extends RpcResponse>( msg: RpcRequest<J>) {
      // this.ws.send( JSON.stringify(msg));
      this.ws.send( encode( msg ) );
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
    /*
    call<Req extends RpcRequest, Resp extends RpcResponse>(req: Req, listener: (response: Resp) => void ): void {
      this.xsend( req);
      // subscribe on queue for response with the same msg id, as req.id
      this.rpcBus.on( req.id.toString(), listener);
    }
    */

   call
   // pierwsze jest potrzebne zeby moglo by uzyte w drugim
   // drugie bo to typ pierwszego argumentu
   // trzecie probujemy ustawic jako typ drugiego argumentu, bo pierwszy nie dziala
   < T extends RpcRequest<K>, /*where*/ K extends RpcResponse >
   ( req: T, listener: (response: K) => void ): void {
       this.send( req); // send request with websocket
       // subscribe on queue for response with the same msg id as req.id
       this.rpcBus.on( req.id.toString(), listener);
   }

}
