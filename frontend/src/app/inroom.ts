import { MyEnum } from './domain/myenum';
import { Component, OnInit } from '@angular/core';
import { Developer } from './domain/developer';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'inroom',
  template: '<h3>inside room</h3>',
})
export class InRoomComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

}
