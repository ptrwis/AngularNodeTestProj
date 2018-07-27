import { MSG_TYPE } from './msg_types';
import { BaseMsg } from './generic';

/**
 * Response is of type SimpleResult
 */
export class SignUpMsg extends BaseMsg {
    username: string;
    password: string;
    constructor( username: string, password: string) {
        super( MSG_TYPE.SIGNUP);
        this.username = username;
        this.password = password;
    }
}