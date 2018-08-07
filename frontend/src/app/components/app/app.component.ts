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
  rpcResp: string;
  connState: string;

  constructor( private wss: WebsocketClientService) {
    wss.registerOnOpenListener( (readyState) => this.connState = readyState.toString() );
    wss.registerOnCloseListener( (readyState) => this.connState = readyState.toString() );
  }

  ngOnInit(): void {
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
      (msg: AddResult) => {
        console.log( msg.result);
        this.rpcResp = `${a} + ${b} = ${msg.result.toString()}`;
      }
    );
  }

}
