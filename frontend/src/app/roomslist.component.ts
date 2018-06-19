import { MyEnum } from './domain/myenum';
import { Component, OnInit } from '@angular/core';
import { Developer } from './domain/developer';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'roomlist',
  template: '<h3>room list</h3>',
})
export class RoomlistComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

}
