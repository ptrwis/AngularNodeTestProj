abstract class JRequest<T extends  JResponse>{
    id: number;
}

abstract class JResponse{
    id: number;
}


class JRoomList extends JResponse {
    roomList: string;
}

class JGetRoomList extends JRequest<JRoomList>{
}

class Program { 
    
    rpcBus: EventEmitter = new EventEmitter();
    
    call
    <Req extends JRequest<Resp>, Resp extends JResponse>
    ( request: Req, listener: (r: Resp)=>void ): void {
        // ( ... )
    }
    
    main( args: string[] ) {
        new Program().call( 
                new JGetRoomList(), 
                (rl) => console.log(rl.roomList)
        );
    }
    
}
