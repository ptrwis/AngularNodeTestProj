import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  token: String;

  constructor() {
    this.token = null;
  }

  login( username: string, password: string) {
    // get token from server
    if ( username === 'asd' && password === 'asd' ) {
      this.token = 'dupa';
    }
    return this.isAuth();
  }

  logout() {
    this.token = null;
  }

  isAuth() {
    return this.token != null;
  }

}
