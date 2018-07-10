import { AuthService } from './../../services/auth.service';
import { MyEnum } from './../../domain/myenum';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Developer } from './../../domain/developer';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
})
export class SignInComponent implements OnInit, OnDestroy {

  username: string;
  password: string;
  authService: AuthService;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    authService: AuthService
  ) {
    this.authService = authService;
  }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

  handleSignIn(event: MouseEvent) {
    if ( this.authService.login( this.username, this.password)) {
      this.router.navigate(['./roomlist']);
    }
  }

  handleSignOut(event: MouseEvent) {
    this.authService.logout();
    this.router.navigate(['./signin']);
  }


}
