import { MSG_TYPE } from "./msg_types";

// just to mark classes
// export interface PeerToServer { }
// export interface ServerToPeer { }

/**
 * 'id' is required in case it is request-response communication.
 * In such case id of response must be same as id of request.
 */
export class BaseMsg{
    constructor( public type: MSG_TYPE, 
                 public id?: number ){
        if( id === undefined )
            this.id = Math.floor(Math.random() * 10000);
    }
}
