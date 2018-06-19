import { MyEnum } from './domain/myenum';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Developer } from './domain/developer';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
})
export class SignInComponent implements OnInit, OnDestroy {

  username: string;
  password: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    console.log("ngOnInit");
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy");
  }

  handleSignIn(event: MouseEvent){
    if( this.username==='asd' && this.password==='asd' )
      this.router.navigate(['./roomlist']);
  }

}
