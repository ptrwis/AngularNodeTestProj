import { BaseMsg } from './../../../../../common/protocol/generic';
import { AddTwoNumbers, AddResult } from './../../../../../common/protocol/addition';
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
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    this.wss.call(
      new AddTwoNumbers(a, b),
      (msg: BaseMsg) => {
        const result = msg as AddResult;
        console.log( result.result);
        this.rpcResp = `${a} + ${b} = ${result.result.toString()}`;
      }
    );
  }

}
