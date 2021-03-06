import { MSG_TYPE, Result, EVENT_TYPE } from "./msg_types";

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
export abstract class XBaseMsg{
    constructor( public type: MSG_TYPE ){ }
}

/**
 * 
 */
export abstract class XRequest<T extends XResponse> extends XBaseMsg{
    id: number;
    constructor( type: MSG_TYPE){
        super( type );
        this.id = Math.floor(Math.random() * 10000);
    }
}

/**
 * Response doesnt have to have type, but must have id (the same as request- 
 * this is how we'll know what request is thi response for)
 */
export abstract class XResponse extends XBaseMsg{
    id: number;
    /**
     * 
     * @param req on which request is this response for
     * @param result ok or not ok
     * @param errormsg error msg if not ok
     */
    constructor( req: XRequest<XResponse>, 
                 public result: Result,
                 public errormsg?: string){
        super( MSG_TYPE.RESPONSE );
        this.id = req.id;
    }
}

/**
 * Abstract event
 */
export abstract class XEvent extends XBaseMsg{
    constructor( public event_type: EVENT_TYPE ){
        super( MSG_TYPE.EVENT );
    }
}

/**
 * Just a stub for requests without responses,
 * it is caller's responsibility to not
 * pass listener when there is no reponse
 */
/*export class VoidResponse extends XResponse{

}*/

/**
 * XCmd is a message without response.
 * This is in particular for send() method of WebsocketService.
 * Not-abstract XBaseMsg could also be used, but let's introduce some hierarchy.
 */
export class XCmd extends XBaseMsg{
    constructor( type: MSG_TYPE){
        super( type );
    }
}