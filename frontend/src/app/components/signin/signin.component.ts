import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { WebsocketClientService } from '../../services/websocket.service';

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

  handleSignIn( event: MouseEvent ) {
    // TODO: wait? guard on roomlist?
    this.wss.connect();
    if ( this.authService.login( this.username, this.password)) {
      this.router.navigate(['./roomlist']);
    }
  }

  handleSignOut( event: MouseEvent ) {
    this.authService.logout();
    this.wss.disconnect();
    this.router.navigate(['./signin']);
  }


}
