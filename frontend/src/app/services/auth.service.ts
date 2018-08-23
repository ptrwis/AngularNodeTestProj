import { Injectable } from '@angular/core';
import { SignInReq, SignInResp } from '../../../../common/protocol/sign_in';
import { Result } from '../../../../common/protocol/msg_types';
import { WebsocketService } from './webosocket.service';

@Injectable()
export class AuthService {

  token: String;
  username: string;

  constructor(private wss: WebsocketService) {
    this.token = null;
  }

  /**
   * There is no way to return anything from wss.call/listener, so the third argument is lambda/callback,
   * which is being called after geeting response from call(SignInReq). This callback will get response
   * as an argument.
   * @param username
   * @param password
   * @param onResponse
   */
  login( username: string, password: string,
         onResponse: (resp: SignInResp) => void) {
    // start of 'login' method body
    this.wss.call(
        // request
        new SignInReq(username, password),
        // callback called after receiving response
        (resp: SignInResp) => {
            if (resp.result === Result.RESULT_OK) {
              this.token = 'dupa';
              this.username = username;
            }
            // additionally run callback passed as 'login's method argument
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
