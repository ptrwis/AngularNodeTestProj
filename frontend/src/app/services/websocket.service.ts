import { Injectable } from '@angular/core';

@Injectable()
export class WebsocketService {

    ws: WebSocket;

    connect() {
        if ( this.ws === undefined ) {
            this.ws = new WebSocket('ws://localhost:8999');
        }
    }

    disconnect() {
        this.ws.close();
        this.ws = undefined;
    }

    getState() {
        if ( this.ws === undefined ) {
            return 'null';
        }
        switch ( this.ws.readyState) {
            case 0: return  'CONNECTING	0	The connection is not yet open.';
            case 1: return  'OPEN	    1	The connection is open and ready to communicate.';
            case 2: return  'CLOSING	2	The connection is in the process of closing.';
            case 3: return  'CLOSED	    3	The connection is closed or couldn\'t be opened.';
        }
    }

}
