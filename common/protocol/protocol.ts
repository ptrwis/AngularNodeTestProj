import { WebsocketClientService } from './../../frontend/src/app/services/websocket.service';
import { MSG_TYPE } from './types';
import { BaseMsg, PeerToServer, ServerToPeer } from './generic';

// ============================
//      FROM PEER TO SERVER
// ============================

export class SignInMsg extends BaseMsg implements PeerToServer {
    username: string;
    password: string;
    constructor( username: string, password: string) {
        super( MSG_TYPE.SIGNIN);
        this.username = username;
        this.password = password;
    }
}

export class SignUpMsg extends BaseMsg implements PeerToServer {
    username: string;
    password: string;
    constructor( username: string, password: string) {
        super( MSG_TYPE.SIGNUP);
        this.username = username;
        this.password = password;
    }
}


// ============================
//     FROM SERVER TO PEER(S)
// ============================

export class ServerMsg extends BaseMsg implements ServerToPeer {
    msg: string;
    constructor( msg: string) {
        super(MSG_TYPE.SERVER_MSG)
        this.msg = msg;
    }
}

