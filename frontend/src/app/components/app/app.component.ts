import { AddTwoNumbersReq, AddResultResp } from '../../../../../common/protocol/addition';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { WebsocketService } from '../../services/webosocket.service';

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
               private wss: WebsocketService) {
  }

  ngOnInit(): void {
    // this.wssetup.setup() // in constructor
    this.wss.connect(
      () => this.connState = 'connected',
      () => {
        this.connState = 'disconnected';
        this.authService.logout(); // should it send info to server? where? ( client can sign out manually )
        this.router.navigate(['./signin']);
        // alert('You have been disconnected!'); // not here
      }
    );
  }

  on_makeRpcRequest_BtnClick() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    this.wss.call(
      new AddTwoNumbersReq(a, b),
      (msg: AddResultResp) => {
        console.log( msg.result);
        this.rpcResp = `${a} + ${b} = ${msg.result.toString()}`;
      }
    );
  }

}
