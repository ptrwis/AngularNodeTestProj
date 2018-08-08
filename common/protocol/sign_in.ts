import { XRequest, XResponse } from "./generic";
import { MSG_TYPE, Result } from "./msg_types";

export class SignInReq extends XRequest<SignInResp> {
    constructor( public username: string, 
                 public password: string) {
        super( MSG_TYPE.SIGNIN);
    }
}

export class SignInResp extends XResponse {
    constructor( req: SignInReq, result: Result, err_msg?: string ){
        super( req, result, err_msg );
    }
}