import { MSG_TYPE } from "./msg_types";

// just to mark classes
// export interface PeerToServer { }
// export interface ServerToPeer { }

/**
 * 'id' is required in case it is request-response communication.
 * In such case id of response must be same as id of request.
 */
/*
export class BaseMsg{
    constructor( public type: MSG_TYPE, 
                 public id?: number ){
        if( id === undefined )
            this.id = Math.floor(Math.random() * 10000);
    }
}
*/

export interface XBaseMsg{
}

/**
 * 
 */
export abstract class XRequest<T extends XResponse> implements XBaseMsg{
    id: number;
    constructor( public type: MSG_TYPE){
        this.id = Math.floor(Math.random() * 10000);
    }
}

/**
 * Response doesnt have to have type, but must have id (the same as request- 
 * this is how we'll know what request is thi response for)
 */
export abstract class XResponse implements XBaseMsg{
    id: number;
    type: MSG_TYPE;
    constructor( req: XRequest<XResponse>) {
        this.id = req.id;
        this.type = MSG_TYPE.RESPONSE;
    }
}

/**
 * Event has only type
 */
export abstract class XEvent implements XBaseMsg{
    constructor( public type: MSG_TYPE ){ }
}

export class VoidResponse extends XResponse{

}