import { MSG_TYPE, Result } from "./msg_types";
import { XRequest, XResponse } from "./generic";

export class AddTwoNumbers extends XRequest<AddResult> {
    constructor( public a: number, 
                 public b: number){
        super( MSG_TYPE.ADD);
    }
}


export class AddResult extends XResponse {
    result: number;
    constructor( req: AddTwoNumbers) {
        // actually message couldnt be parsed, so RESULT_FAIL is possible
        super( req, Result.RESULT_OK );
        this.result = req.a + req.b;
    }
}