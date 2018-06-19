import { MyEnum } from './domain/myenum';
import { Component, OnInit } from '@angular/core';
import { Developer } from './domain/developer';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'createroom',
  template: '<h3>create room</h3>',
})
export class CreateRoomComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

}
