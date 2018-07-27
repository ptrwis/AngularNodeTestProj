import { BaseMsg } from "./generic";
import { MSG_TYPE } from "./msg_types";

export enum Result{
    RESULT_OK,
    RESULT_FAIL
}

export class SimpleResult extends BaseMsg {
    result: Result;
    constructor(  ){
        super( MSG_TYPE.RESPONSE );
    }
}