import { Vec2d } from '../../../../../common/game/vec2d';
import { Component, OnInit, AfterViewInit, ViewChild, Input, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTheRoomMsg } from '../../../../../common/protocol/leave_room';
import { WebsocketClientService } from '../../services/websocket.service';

@Component({
  selector: 'gameplay',
  template:
  `<h3>GamePlay {{roomid}}</h3>
  <h4>Click on the owls to make them flying!</h4>
  <input type="radio" name="dir" [value]='-1' (click)='onRadioChange(-1)' checked>
  clockwise <br />
  <input type="radio" name="dir" [value]='+1' (click)='onRadioChange(+1)'>
  counter-clockwise <br/>
  <canvas #kanvas ></canvas>
  <owl posx="70" posy="500"
       factorx="1.0" factory="0.5"
       rounds="2" ></owl>
  <owl posx="140" posy="500"
       factorx="2.0" factory="0.5"
       rounds="4" ></owl>
  <owl posx="210" posy="500"
       factorx="0.5" factory="1.0"
       rounds="4" ></owl>
  <owl posx="280" posy="500"
       factorx="0.5" factory="2.0"
       rounds="4" ></owl>
  <owl posx="350" posy="500"
       factorx="1.0" factory="1.0"
       rounds="4" ></owl>
  <br /> <br /> <br /> <br />
  <button (click)="onLeaveRoomButtonClick()" >Leave</button>`,
  styles: [`canvas { border: 1px solid black; }`]
})
export class GamePlayComponent implements AfterViewInit, OnInit, OnDestroy {

  roomid: number;
  private sub: any; // subscription to route's parameters change

  constructor(
    private wss: WebsocketClientService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  @ViewChild('kanvas') canvasRef: ElementRef;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  @Input() public width = 320;
  @Input() public height = 240;
  private angle: number;
  private rotDir: number;

  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.roomid = +params['id']; // (+) converts string 'id' to a number
    });
  }

  public ngAfterViewInit() {
    this.rotDir = -1;
    // get the context
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    // set the width and height
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    // set some default properties about the line
    this.ctx.lineWidth = 3;
    // this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#FF0000';
    this.drawOnCanvas();
  }

  private drawOnCanvas() {
    const unixms = new Date().getTime();
    // incase the context is not set
    if (!this.ctx) { return; }
    // clear canvas
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // start our drawing path
    this.ctx.beginPath();
    // sets the start point
    this.ctx.moveTo(this.width / 2, this.height / 2); // from
    // draws a line from the start pos until the current position
    const angle = this.rotDir * unixms * 0.005;
    const to = new Vec2d( 80, 0 ).rot( angle );
    this.ctx.lineTo(
      this.width / 2 + to.x,
      this.height / 2 + to.y
    );
    // strokes the current path with the styles we set earlier
    this.ctx.stroke();
    requestAnimationFrame(this.drawOnCanvas.bind(this));
  }

  ngOnDestroy() {
    // subscription is in ngOnInit
    this.sub.unsubscribe();
    this.wss.send( new LeaveTheRoomMsg(this.roomid) );
  }

  /**
   * dont know how to run it yet
   */
  /*private drawOnCanvas2(){
    var app = new PIXI.Application(320, 240, {backgroundColor : 0x1099bb});
    document.body.appendChild(app.view);
    var bunny = PIXI.Sprite.fromImage('https://c.staticblitz.com/assets/packs/blitz_logo-11cebad97cad4b50bc955cf72f532d1b.png');
    bunny.anchor.set(0.5);
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    app.stage.addChild(bunny);
    app.ticker.add(function(delta) {
        bunny.rotation += 0.1 * delta;
    });
  }*/

  public redraw() {
    this.drawOnCanvas();
  }

  private onRadioChange(dir: number) {
    this.rotDir = dir;
  }

  /**
   * This will trigger ngOnDestroy
   */
  onLeaveRoomButtonClick( ) {
    this.router.navigate( ['./roomlist'] );
  }

}
