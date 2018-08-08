import { Injectable } from '@angular/core';
import { WebsocketClientService } from './websocket.service';
import { SignInReq, SignInResp } from '../../../../common/protocol/sign_in';
import { Result } from '../../../../common/protocol/msg_types';

@Injectable()
export class AuthService {

  token: String;

  constructor(private wss: WebsocketClientService) {
    this.token = null;
  }

  login(username: string, password: string, onResponse: (resp: SignInResp) => void) {
    this.wss.call(
      new SignInReq(username, password),
      (resp: SignInResp) => {
        if (resp.result === Result.RESULT_OK) {
          this.token = 'dupa';
        }
        onResponse(resp);
      }
    );
  }

  logout() {
    this.token = null;
  }

  isAuth() {
    return this.token != null;
  }

}
