import { Injectable } from '@angular/core';
import { XRequest, XResponse } from '../../../../common/protocol/generic';
import { WebsocketClientService } from './websocket.service';
import { EventEmitter } from 'events';

/**
* Handling messages on WebSocket level is implemented in WebsocketClientService
*/
@Injectable()
export class RemoteProcCall {

    private rpcBus: EventEmitter;

    constructor(public wss: WebsocketClientService) {
        this.rpcBus = new EventEmitter();
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
            this.wss.send(req);
            // callback called right after sending
            if (onSentListener !== undefined) {
                onSentListener();
            }
            // subscribe on queue for response with the same msg id as req.id
            // if ( K instanceof VoidResponse ) { return; }
            if (onResponseListener !== undefined) {
                this.rpcBus.on(req.id.toString(), onResponseListener);
            }
        }

    handle( response: XResponse ) {
        console.log( response );
        this.rpcBus.emit( response.id.toString(), response);
    }

}
