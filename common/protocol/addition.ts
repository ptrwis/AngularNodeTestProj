import { MSG_TYPE } from "./msg_types";
import { BaseMsg } from "./generic";


export class AddTwoNumbers extends BaseMsg {
    constructor( public a: number, 
                 public b: number){
        super( MSG_TYPE.ADD);
    }
}


export class AddResult extends BaseMsg {
    result: number;
    constructor( req: AddTwoNumbers) {
        super( MSG_TYPE.RESPONSE, req.id );
        this.result = req.a + req.b;
    }
}