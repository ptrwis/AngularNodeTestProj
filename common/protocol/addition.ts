import { MSG_TYPE } from "./msg_types";
import { XRequest, XResponse } from "./generic";

/*
export class AddTwoNumbers extends BaseMsg {
    constructor( public a: number, 
                 public b: number){
        super( MSG_TYPE.ADD);
    }
}


export class AddResult extends BaseMsg {
    result: number;
    constructor( req: AddTwoNumbers) {
        super( MSG_TYPE.RESPONSE, req.id );
        this.result = req.a + req.b;
    }
}
*/

export class AddTwoNumbers extends XRequest<AddResult> {
    constructor( public a: number, 
                 public b: number){
        super( MSG_TYPE.ADD);
    }
}


export class AddResult extends XResponse {
    result: number;
    constructor( req: AddTwoNumbers) {
        super( req );
        this.result = req.a + req.b;
    }
}