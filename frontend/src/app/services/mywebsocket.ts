import { XBaseMsg } from "../../../../common/protocol/generic";
import * as msgpack from 'msgpack-lite';

export class MyWebsocket {

    private url: string;
    private ws: WebSocket;
    private onMessage: (MessageEvent) => void;
    // websocket lifecycle listeners
    private onOpenListeners: ((number) => void)[];
    private onCloseListeners: ((number) => void)[];

    constructor() {
        this.url = 'ws://localhost:8999';
        this.ws = undefined;
        this.onOpenListeners = [];
        this.onCloseListeners = [];
    }

    connect() {
        if (this.isConnected() === true) {
            return;
        }
        this.ws = new WebSocket(this.url);
        this.ws.binaryType = 'arraybuffer'; // necessary!
        this.ws.onmessage = this.onMessage;
        // assign lambdas calling all registered lifecycle listeners
        this.ws.onopen = (ev: Event) => this.onOpenListeners.forEach(listener => listener(this.ws.readyState));
        this.ws.onclose = (ev: CloseEvent) => this.onCloseListeners.forEach(listener => listener(0));
    }

    disconnect() {
        // this.send( new RageQuit()); not here
        if (this.isConnected()) {
            this.ws.close();
            this.ws = undefined;
        }
    }

    isConnected() {
        return this.ws !== undefined && this.ws.readyState === 1;
    }

    setOnMessage( handler: (MessageEvent) => void ) {
        this.onMessage = handler;
    }

    /**
     * Lifecycle listeners
     * argument of lambda is value of WebSocket.readyState
     * // TODO: unsubscribe
     * @param onOpenListener
     */
    registerOnOpenListener(onOpenListener: (number) => void) {
        this.onOpenListeners.push(onOpenListener);
    }
    registerOnCloseListener(onCloseListener: (number) => void) {
        this.onCloseListeners.push(onCloseListener);
    }


    /**
     * 
     * @param ev 
     * @param onSentListener 
     */
    send(ev: XBaseMsg, onSentListener?: () => any) {
        this.ws.send(msgpack.encode(ev)); // MsgPack
        if (onSentListener !== undefined) {
            onSentListener();
        }
    }

}