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

class UserEntity {
    constructor(
        public username: string,
        public password: string) {
    }
}
let usersDatabase: UserEntity[] = [
    new UserEntity('John Rambo', 'qwe'),
    new UserEntity('Billy The Kid', 'asd'),
    new UserEntity('Dirty Harry', 'zxc'),
];

/**
 * 
 */
class Peer {
    id: number;
    // userEntity: UserEntity; // TODO: guests
    rooms: ServerRoom[];
    ws: WebSocket;

    constructor(id: number, ws: WebSocket) {
        this.id = id;
        this.ws = ws;
        this.rooms = [];
    }
    // send msg to this peer
    send(msg: XBaseMsg) {
        // this.ws.send( JSON.stringify(msg) );
        this.ws.send(msgpack.encode(msg));
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
        this.id = ServerRoom.idcounter++;
        this.peers = [];
        this.roomname = name;
    }
    broadcast(sender: Peer, msg: XBaseMsg, excludeSender: boolean) {
        const m = msgpack.encode(msg);
        // TODO: ugly
        if (excludeSender === false) {
            this.peers.forEach(peer => peer.justSend(m));
        } else {
            this.peers.forEach(peer => peer.id === sender.id ? peer.justSend(m) : null);
        }
    }
    join(peer: Peer) {
        this.peers.push(peer);
        this.broadcast(
            peer,
            new PeerJoinedTheRoomMsg(peer.id, `Guest ${peer.id}`, this.id),
            true
        );
        peer.send(new ServerMsg(`You have joined room ${this.roomname}`));
    }
    leave(peer: Peer) {
        this.broadcast(
            peer,
            new PeerLeftTheRoomMsg(peer.id, this.id),
            true
        );
        this.peers = this.peers.filter((p) => p.id !== peer.id);
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
        let baseMsg = msgpack.decode(message) as XRequest<any>;
        // TODO: safe casting (we can immidiatelly drop user and ban him on exception)
        // TODO: check if user is singed in
        switch (baseMsg.type) {
            case MSG_TYPE.CHAT_MSG: {
                let chatMsg = baseMsg as ChatMsg;
                this.runCallbackWithGuard(sender, chatMsg.roomid,
                    (room: ServerRoom) => room.broadcast(
                        sender,
                        new ChatEvent(sender.id, `${sender.id}: ${message}`, room.id),
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
                    (room: ServerRoom) => room.broadcast(sender, new PeerLeftTheRoomMsg(sender.id, room.id), true)
                );
            } break;
            case MSG_TYPE.CREATE_ROOM: {
                let request = baseMsg as CreateRoomMsg;
                let found = false;
                this.rooms.forEach((k, v) => { // find room by roomname
                    if (k.roomname === request.roomname) {
                        found = true;
                        // break;  // TODO: Jump target cannot cross function boundary
                    }
                });
                if (found == false) {
                    let newRoom = new ServerRoom(request.roomname);
                    this.rooms.set(newRoom.id, newRoom);
                    sender.send( new RoomCreatedResp(request, newRoom.id, Result.RESULT_OK) );
                    // For each player in idle send info (event) about new room. Otherwise just force players to click "refresh"
                    this.rooms.forEach(r => r.broadcast(
                        sender, 
                        new RoomHasBeenCreated(new Room(request.roomname, 1, newRoom.id)), 
                        true)
                    );
                } else {
                    sender.send( new RoomCreatedResp( request, -1, Result.RESULT_FAIL, 'Server: Such room already exists!') );
                }
            } break;
            case MSG_TYPE.SIGNIN: {
                // We can allow Guests playing 
                // const user = usersDatabase.find( username, password);
                // send back a token
                // --> DO WE NEED IT ?! after all connection is stateful, after signing in we are holding the peer, we dont need to
                //      authenticate him on every request
                //          --> user might disconnect, so we might generate him the token, he will use it when trying to reconnect
                // btw: kick guests with inactive fpr some time.
                let request = baseMsg as SignInReq;
            } break;
            case MSG_TYPE.SIGNUP: {
                let request = baseMsg as SignUpReq;
                usersDatabase.push(new UserEntity(request.username, request.password));
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
                const response = new RoomList(rooms, request);
                sender.send(response);
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
    let peer = new Peer(Math.floor(Math.random() * 100_000) + 1, ws);
    ws.on('message', (message: Buffer) => myServer.route(peer, message));
    ws.on('close', () => myServer.rageQuit(peer));
});

// start
server.listen(process.env.PORT || 8999);
