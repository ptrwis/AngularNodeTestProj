import { MSG_TYPE } from "./types";

// just to mark classes
export interface PeerToServer { }
export interface ServerToPeer { }

export class BaseMsg{
    constructor( type: MSG_TYPE ){
    }
}

 /**
  * Response with the same id expected
  */
 export class CommandMsg extends BaseMsg implements PeerToServer {
    constructor( id: number,
                 type: MSG_TYPE,
                 content: string){
        super( type );
    }
}

/**
 * Reponse to CommandMsg.
 * After recognizing MSG_TYPE.RESPONSE, rpc just rethrows the
 * message to local rpc bus.
 */
export class ResponseMsg extends BaseMsg implements ServerToPeer {
    constructor( id: number,
                 content: string){
        super( MSG_TYPE.RESPONSE );
    }
}

/**
 * like 'player turned left' no reponse expected
 */
export class ActionMsg extends BaseMsg implements PeerToServer {
    constructor( type: MSG_TYPE,
                 content: string ){// + what and when
        super( type );
    }
}

/**
 * player X turned left
 */
export class BroadcastMsg implements ServerToPeer {
    constructor(
        sender_id: number,
        type: MSG_TYPE,
        content: string
    ){
    }
}
