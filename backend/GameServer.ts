import { AddTwoNumbers, AddResult } from './../common/protocol/addition';
import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as msgpack from 'msgpack-lite';
import { MSG_TYPE, Result } from '../common/protocol/msg_types';
import { XBaseMsg, XRequest } from '../common/protocol/generic';
import { PeerJoinedTheRoomMsg, JoinRoomMsg } from '../common/protocol/join_room';
import { LeaveTheRoomMsg, PeerLeftTheRoomMsg } from '../common/protocol/leave_room';
import { ChatEvent, ChatMsg } from '../common/protocol/chat';
import { ServerMsg } from '../common/protocol/server_msg';
import { CreateRoomMsg, RoomHasBeenCreated, RoomCreatedResp } from '../common/protocol/create_room';
import { SignInReq, SignInResp } from '../common/protocol/sign_in';
import { SignUpReq, SignUpResp } from '../common/protocol/sign_up';
import { GetRoomList, Room, RoomList } from '../common/protocol/get_room_list';
import { GetRoomDetails, RoomDetailsResp } from '../common/protocol/get_room';

/**
 * 
 */
class UserEntity {
    constructor(
        public id: number,
        public username: string,
        public password: string) {
    }
}

/**
 * 
 */
class UserDatabase {

    userIdSeq: number;
    userbase: UserEntity[];

    constructor() {
        this.userbase = [
            new UserEntity(1, 'qwe', 'qwe'),
            new UserEntity(2, 'asd', 'asd'),
            new UserEntity(3, 'zxc', 'zxc'),
        ];
        const max = this.userbase.reduce((a, b) => a.id > b.id ? a : b);
        this.userIdSeq = max.id;
    }

    findByCredentials(username: string, password: string) {
        return this.userbase.find((x) => x.username === username && x.password === password);
    }

    findById(id: number) {
        return this.userbase.find((x) => x.id === id);
    }

    insert(username: string, password: string) {
        this.userbase.push(new UserEntity(++this.userIdSeq, username, password));
        return this.userIdSeq;
    }

} let userDatabase = new UserDatabase();

/**
 * 
 */
class Peer {
    rooms: ServerRoom[];
    // requestPerSecondCounter // increase on every request, if too much- kick fucker

    constructor(public user: UserEntity, // negative id means guest
        public ws: WebSocket) {
        this.rooms = [];
    }
    // send msg to this peer
    send(msg: XBaseMsg) {
        // this.ws.send( JSON.stringify(msg) );
        this.ws.send(msgpack.encode(msg));
        console.log( msg );
    }
    // don't encode, useful for broadcasts (msg is encoded once and as such broadcasted)
    justSend(msg: Buffer) {
        this.ws.send(msg);
    }
    join(room: ServerRoom) {
        this.rooms.push(room);
        room.join(this);
    }
    leave(room: ServerRoom) {
        this.rooms = this.rooms.filter((p) => p.roomname !== room.roomname);
        room.leave(this);
    }
    isGuest() { this.user.id < 0; }
}


/**
 * 
 */
class ServerRoom {
    static idcounter: number = 0;
    id: number = 0;
    peers: Peer[];
    roomname: string;
    constructor(name: string) {
        this.id = ++ServerRoom.idcounter;
        this.peers = [];
        this.roomname = name;
    }
    broadcast(sender: Peer, msg: XBaseMsg, excludeSender: boolean) {
        const m = msgpack.encode(msg);
        // TODO: ugly
        if (excludeSender === false) {
            this.peers.forEach(peer => peer.justSend(m));
        } else {
            this.peers.forEach(peer => peer.user.id === sender.user.id ? peer.justSend(m) : null);
        }
    }
    join(peer: Peer) {
        this.peers.push(peer);
        this.broadcast(
            peer,
            new PeerJoinedTheRoomMsg(peer.user.id, `Guest ${peer.user.id}`, this.id),
            true
        );
        peer.send(new ServerMsg(`You have joined room ${this.roomname}`));
    }
    leave(peer: Peer) {
        this.broadcast(
            peer,
            new PeerLeftTheRoomMsg(peer.user.id, this.id),
            true
        );
        this.peers = this.peers.filter((p) => p.user.id !== peer.user.id);
    }
}


/**
 * 
 */
class GameServer {
    rooms: Map<number, ServerRoom>;

    constructor() {
        this.rooms = new Map();
    }
    rageQuit(peer: Peer) {
        this.rooms.forEach((room) => room.leave(peer));
    }
    route(sender: Peer, message: Buffer) {
        // we have to parse it here, to forward message to apporpriate room
        // let baseMsg = JSON.parse(message) as BaseMsg; // JSON string
        let baseMsg = msgpack.decode( message ) as XRequest<any>;
        console.log( `Request: ${baseMsg}` );
        // TODO: safe casting (we can immidiatelly drop user and ban him on exception)
        // TODO: check if user is singed in
        switch (baseMsg.type) {
            case MSG_TYPE.CHAT_MSG: {
                let chatMsg = baseMsg as ChatMsg;
                this.runCallbackWithGuard(sender, chatMsg.roomid,
                    (room: ServerRoom) => room.broadcast(
                        sender,
                        new ChatEvent(sender.user.id, `${sender.user.id}: ${message}`, room.id),
                        true
                    )
                );
            } break;
            case MSG_TYPE.JOIN_ROOM: {
                let request = baseMsg as JoinRoomMsg;
                this.runCallbackWithGuard(sender, request.roomid,
                    (room: ServerRoom) => room.join(sender)
                );
            } break;
            case MSG_TYPE.LEAVE_THE_ROOM: {
                let request = baseMsg as LeaveTheRoomMsg;
                this.runCallbackWithGuard(sender, request.roomid,
                    (room: ServerRoom) => room.broadcast(sender, new PeerLeftTheRoomMsg(sender.user.id, room.id), true)
                );
            } break;
            case MSG_TYPE.CREATE_ROOM: {
                let request = baseMsg as CreateRoomMsg;
                // todo; check if not exists
                let found = false;
                /* if (found == true) {
                    sender.send(new RoomCreatedResp(request, -1, Result.RESULT_FAIL, 'Server: Such room already exists!'));
                    return;
                } */
                let newRoom = new ServerRoom(request.roomname);
                this.rooms.set(newRoom.id, newRoom);
                sender.send(new RoomCreatedResp(request, newRoom.id, Result.RESULT_OK));
                // For each player in idle send info (event) about new room. Otherwise just force players to click "refresh"
                this.rooms.forEach(r => r.broadcast(
                    sender,
                    new RoomHasBeenCreated(new Room(request.roomname, 1, newRoom.id)),
                    true
                ));
            } break;
            case MSG_TYPE.SIGNIN: {
                let request = baseMsg as SignInReq;
                let usr = userDatabase.findByCredentials(request.username, request.password);
                if (usr === undefined) {
                    sender.send(new SignInResp(request, Result.RESULT_FAIL, "Bad crdentials"));
                } else {
                    sender.user = usr;
                    sender.send(new SignInResp(request, Result.RESULT_OK));
                }
            } break;
            case MSG_TYPE.SIGNUP: {
                let request = baseMsg as SignUpReq;
                let userId = userDatabase.insert(request.username, request.password);
                // send email
                sender.send(new SignUpResp(request, Result.RESULT_OK));
            } break;
            case MSG_TYPE.ADD: {
                let request = baseMsg as AddTwoNumbers;
                console.log(`${request.a} + ${request.b}`);
                sender.send(new AddResult(request));
            } break;
            case MSG_TYPE.GET_ROOM_LIST: {
                let request = baseMsg as GetRoomList;
                // TODO: cache it, change when room is created or removed
                let rooms: Room[] = [];
                this.rooms.forEach((v, k) => rooms.push(new Room(v.roomname, v.peers.length, k)));
                sender.send( new RoomList(rooms, request) );
            } break;
            case MSG_TYPE.GET_ROOM_DETAILS: {
                let request = baseMsg as GetRoomDetails;
                let room = this.rooms.get( request.room_id );
                if( room === undefined ){
                    sender.send( new RoomDetailsResp( new Room("",0,0), request, Result.RESULT_FAIL, "No such room exists!") );
                    return;
                }
                sender.send( 
                    new RoomDetailsResp( 
                        new Room(room.roomname, room.peers.length, room.id), 
                        request, 
                        Result.RESULT_FAIL, "No such room exists!"
                    ) 
                );
            } break;
        }
    }
    /**
     * checks room's existence
     * @param sender 
     * @param roomid 
     * @param callback 
     */
    runCallbackWithGuard(sender: Peer, roomid: number, callback: (room: ServerRoom) => void) {
        let room = this.rooms.get(roomid);
        if (room === undefined) {
            sender.send(new ServerMsg(`Server: Such room does not exists!`));
        } else {
            callback(room);
        }
    }
}


/**
 * SETUP AND START
 */
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let myServer = new GameServer();

wss.on('connection', (ws: WebSocket) => {
    // this works like closure- peer will be remembered
    let guestId = (- 1 - Math.floor(Math.random() * 100_000));
    let peer = new Peer(new UserEntity(guestId, "", ""), ws);
    ws.on('message', (message: Buffer) => myServer.route(peer, message));
    ws.on('close', () => myServer.rageQuit(peer));
});

// start
server.listen(process.env.PORT || 8999);
