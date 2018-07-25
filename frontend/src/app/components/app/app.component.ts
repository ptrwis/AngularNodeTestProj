import { RpcReqMsg, RpcRespMsg } from './../../../../../common/protocol/protocol';
import { Component, OnInit } from '@angular/core';
import { WebsocketClientService } from './../../services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'maj app';
  wss: WebsocketClientService;
  rpcResp: string;

  constructor( websocketService: WebsocketClientService) {
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
        // we must cast here reponse to destination class
        console.log( msg.msgid);
        this.rpcResp = JSON.stringify(msg);
      }
    );
  }

}
