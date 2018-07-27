import { BaseMsg } from "./generic";
import { MSG_TYPE } from "./msg_types";

export class SignInMsg extends BaseMsg {
    username: string;
    password: string;
    constructor( username: string, password: string) {
        super( MSG_TYPE.SIGNIN);
        this.username = username;
        this.password = password;
    }
}