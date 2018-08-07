import { MSG_TYPE } from './msg_types';
import { XRequest } from './generic';
import { SimpleResult } from './simple_reponse';

/**
 * This one could actually go as regular HTTP request
 * TODO: hash it before sending through wire or secure connection
 */
export class SignUpMsg extends XRequest<SimpleResult> {
    username: string;
    password: string;
    constructor( username: string, password: string) {
        super( MSG_TYPE.SIGNUP);
        this.username = username;
        this.password = password;
    }
}