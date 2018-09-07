import { MSG_TYPE, Result } from "./msg_types";
import { XRequest, XResponse } from "./generic";

export class AddTwoNumbersReq extends XRequest<AddResultResp> {
    constructor( public a: number, 
                 public b: number){
        super( MSG_TYPE.ADD);
    }
}


export class AddResultResp extends XResponse {
    result: number;
    constructor( req: AddTwoNumbersReq) {
        // actually message couldnt be parsed, so RESULT_FAIL is possible
        super( req, Result.RESULT_OK );
        this.result = req.a + req.b;
    }
}