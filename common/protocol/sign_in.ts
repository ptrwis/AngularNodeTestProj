import { XRequest, XResponse } from "./generic";
import { MSG_TYPE } from "./msg_types";

export class SignInReq extends XRequest<SignInResp> {
    hashed: string;
    constructor( username: string, 
                 password: string) {
        super( MSG_TYPE.SIGNIN);
        this.hashed = username+password; // MD5
    }
}

export class SignInResp extends XResponse {
    constructor( req: SignInReq, public token: string ){
        super( req );
    }
}