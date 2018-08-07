import { XBaseMsg, XResponse, XRequest } from "./generic";
import { MSG_TYPE } from "./msg_types";

export enum Result{
    RESULT_OK,
    RESULT_FAIL
}

export class SimpleResult extends XResponse {
    constructor( public request: XRequest<any>,
                 public result: Result, 
                 public msg?: string ){
        super( request );
    }
}