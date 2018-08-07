import { MSG_TYPE, Result } from "./msg_types";

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

/**
 * It's only interface
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
    type: MSG_TYPE = MSG_TYPE.RESPONSE;
    /**
     * 
     * @param req on which request is this response for
     * @param result ok or not ok
     * @param errormsg error msg if not ok
     */
    constructor( req: XRequest<XResponse>, 
                 public result: Result,
                 public errormsg?: string){
        this.id = req.id;
    }
}

/**
 * Event has only type
 */
export abstract class XEvent implements XBaseMsg{
    constructor( public type: MSG_TYPE ){ }
}

/**
 * Just a stub for requests without responses,
 * it is however caller's responsibility to not
 * pass listener when there is no reponse
 */
export class VoidResponse extends XResponse{

}