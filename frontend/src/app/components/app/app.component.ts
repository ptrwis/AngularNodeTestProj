import { RpcReqMsg, RpcRespMsg } from './../../../../../common/protocol';
import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './../../services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'maj app';
  wss: WebsocketService;
  rpcResp: string;

  constructor( websocketService: WebsocketService) {
    this.wss = websocketService;
  }

  ngOnInit(): void {
  }

  getState() {
    return this.wss.getState();
  }

  wsconnect() {
    this.wss.connect();
  }

  wsdisconnect() {
    this.wss.disconnect();
  }

  rpcRequest() {
    this.wss.call(
      new RpcReqMsg(),
      (msg: RpcRespMsg) => {
        console.log( msg.msgid);
        this.rpcResp = JSON.stringify(msg);
      }
    );
  }

}
