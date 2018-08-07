import { MSG_TYPE, Result } from './msg_types';
import { XRequest, XResponse } from './generic';

/**
 * This one could actually go as regular HTTP request
 * TODO: hash it before sending through wire or secure connection
 */
export class SignUpReq extends XRequest<SignUpResp> {
    username: string;
    password: string;
    constructor( username: string, password: string) {
        super( MSG_TYPE.SIGNUP);
        this.username = username;
        this.password = password;
    }
}

export class SignUpResp extends XResponse{
    constructor( req: SignUpReq, 
                 result: Result, 
                 err_msg?: string ) {
        super( req, result, err_msg );
    }
}