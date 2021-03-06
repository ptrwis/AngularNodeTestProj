import { AuthService } from '../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Result } from '../../../../../common/protocol/msg_types';
import { WebsocketService } from '../../services/webosocket.service';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
})
export class SignInComponent implements OnInit, OnDestroy {

  username: string;
  password: string;

  constructor(
    private wss: WebsocketService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  /**
   * TODO: "onSignInButtonClick"
   * @param event
   */
  handleSignIn(event: MouseEvent) {
    this.authService.login(this.username, this.password,
      // ... after getting response (signing in went ok or not) route or show error
      (resp) => {
        switch (resp.result) {
          case Result.RESULT_OK: this.router.navigate(['./roomlist']); break;
          case Result.RESULT_FAIL: alert('Login failed! :C'); break;
        }
      }
    );
  }

  handleSignOut(event: MouseEvent) {
    this.authService.logout();
    this.wss.disconnect();
    this.router.navigate(['./signin']);
  }

  signInAs( username: string, password: string ) {
    this.authService.login( username, password,
      // ... after getting response (signing in went ok or not) route or show error
      (resp) => {
        switch (resp.result) {
          case Result.RESULT_OK: this.router.navigate(['./roomlist']); break;
          case Result.RESULT_FAIL: alert('Login failed! :C'); break;
        }
      }
    );
  }

}
