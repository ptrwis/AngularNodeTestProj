import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'owl',
  template: `
  <img
  src="http://iconbug.com/data/fd/32/07ce6ff3910136fa7ac84971d641aeb1.png"
  width=50 height=50
  style="position: absolute; "
  [style.left] = "x"
  [style.top] = "y"
  (click)='fly()' #owlId />
  `,
  styles: [``]
})
export class OwlComponent implements OnInit {

  // @ViewChild('kanvas') canvasRef: ElementRef;
  @Input() public posx: number;
  @Input() public posy: number;
  @Input() public factorx = 1.0;
  @Input() public factory = 1.0;
  @Input() public rounds = 1.0;
  x: string;
  y: string;
  private animation = false;
  log = '';
  angle = 0;

  ngOnInit() {
    this.x = this.posx + 'px';
    this.y = this.posy + 'px';
  }

  fly() {
    this.animation = true;
    this.keepFlying();
  }
  public keepFlying() {
    if ((this.angle += 0.1) > this.rounds * ( 2 * Math.PI)) {
      this.animation = false;
      this.angle = 0;
      return;
    }
    // let unixms = new Date().getTime(); //60fps const
    this.x = (+this.posx + 40 * Math.sin(this.factorx * this.angle)) + 'px';
    this.y = (+this.posy + 40 * Math.cos(this.factory * this.angle)) + 'px';
    if (this.animation) {
      requestAnimationFrame(this.fly.bind(this));
    }
  }

}
