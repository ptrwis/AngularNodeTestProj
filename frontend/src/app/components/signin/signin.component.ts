import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { WebsocketClientService } from '../../services/websocket.service';
import { Result } from '../../../../../common/protocol/msg_types';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
})
export class SignInComponent implements OnInit, OnDestroy {

  username: string;
  password: string;

  constructor(
    private wss: WebsocketClientService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

  /**
   * TODO: "onSignInButtonClick"
   * @param event 
   */
  handleSignIn(event: MouseEvent) {
    if (this.wss.isConnected()) {
      this.signIn();
    } else {
      // after connecting ...
      this.wss.registerOnOpenListener(
        // ... try to sign in ...
        () => this.signIn() );
      // ok, now  connect and start above process
      this.wss.connect();
    }
  }

  signIn() {
    this.authService.login(this.username, this.password,
      // ... after getting response (signing in went ok or not) route or show error
      (resp) => {
        switch (resp.result) {
          case Result.RESULT_OK: this.router.navigate(['./roomlist']); break;
          case Result.RESULT_FAIL: alert('Login failed! :C'); break;
        }
      });
  }

  handleSignOut(event: MouseEvent) {
    this.authService.logout();
    this.wss.disconnect();
    this.router.navigate(['./signin']);
  }

}
