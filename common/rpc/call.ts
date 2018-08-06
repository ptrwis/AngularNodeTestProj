/*
export abstract class XRequest<T extends XResponse>{
    constructor(public id: number) { }
}
export abstract class XResponse{
    constructor(public id: number) { }
}


export class XRoomList extends XResponse {
    constructor( id: number, public roomList: string) { 
        super(id);
    }
}
export class XGetRoomList extends XRequest<XRoomList>{
}


export function call
    <Req extends XRequest<Resp>, Resp extends XResponse>
    (ws: WebSocket, request: Req, listener: (r: Resp) => void): void {
        // ws.send( request)
    listener( new XRoomList(2, "xxx") );
}


call(
    new XGetRoomList(2),
    (rl) => console.log(rl.roomList)
);
*/