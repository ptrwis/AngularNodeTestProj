import { AddTwoNumbers, AddResult } from './../../../../../common/protocol/addition';
import { Component, OnInit } from '@angular/core';
import { WebsocketClientService } from './../../services/websocket.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'maj app';
  rpcResp: string;
  connState: string;

  constructor( private router: Router,
               private authService: AuthService,
               private wss: WebsocketClientService) {
    wss.registerOnOpenListener( (readyState) => this.connState = readyState.toString() );
    wss.registerOnCloseListener( () => {
      authService.logout(); // should it send info to server? where? ( client can sign out manually )
      this.router.navigate(['./signin']);
      // alert('You have been disconnected!'); // not here
    } );
    wss.registerOnCloseListener( (readyState) => this.connState = readyState.toString() );
  }

  ngOnInit(): void {
  }

  onConnectButtonClick() {
    this.wss.connect();
  }

  onDisconnectButtonClick() {
    this.wss.disconnect();
  }

  on_makeRpcRequest_BtnClick() {
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
