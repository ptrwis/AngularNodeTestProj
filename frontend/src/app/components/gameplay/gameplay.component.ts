import { Vec2d } from '../../../../../common/game/vec2d';
import { Component, OnInit, AfterViewInit, ViewChild, Input, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTheRoomMsg } from '../../../../../common/protocol/leave_room';
import { WebsocketService } from '../../services/webosocket.service';
import { SimplePlayer, PlayerState, GameEvent, GameEventType } from '../../../../../common/game/game';

@Component({
  selector: 'gameplay',
  template:
  `<h3>GamePlay {{roomid}}</h3>
  <h4>Click on the owls to make them flying!</h4>

  <canvas #kanvas tabindex="1"
                  (keydown)="onKeyDown($event)"
                  (keyup)="onKeyUp($event)"
                  (blur)="onBlur($event)"
                  (focus)="onFocus($event)" >
  </canvas>

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
    private wss: WebsocketService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  @ViewChild('kanvas') canvasRef: ElementRef;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  @Input() public width = 640;
  @Input() public height = 480;
  keysWhichArePressed: Set<string>;
  player: SimplePlayer;
  running = true; // to request next animation frame or not

  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.roomid = +params['id']; // (+) converts string 'id' to a number
    });
    this.keysWhichArePressed = new Set();
    this.player = new SimplePlayer(
      new PlayerState(new Vec2d(0, 0), new Vec2d(1, 0)),
      new GameEvent( this.currentUnixTimeMs(), GameEventType.STR8_FORWARD)
    );
  }

  public ngAfterViewInit() {
    // get the context
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    // set the width and height
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    // set some default properties about the line
    this.ctx.lineWidth = 2;
    // this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#FF0000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawOnCanvas();
  }

  private drawOnCanvas() {
    const unixms = this.currentUnixTimeMs();
    // incase the context is not set
    if (!this.ctx) { return; }
    // clear canvas
    // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // change color with time
    const r = Math.floor((Math.sin(unixms * 0.003) * 0.5 + 0.5) * 250);
    const g = Math.floor((Math.cos(unixms * 0.006) * 0.5 + 0.5) * 250);
    const b = Math.floor((Math.sin(unixms * 0.009) * 0.5 + 0.5) * 250);
    const color = `rgb(${r}, ${g}, ${b})`;
    this.ctx.strokeStyle = color;

    const s = this.player.getCurrentState( unixms );
    this.ctx.beginPath();
    {
      this.ctx.arc(
        s.pos.x + this.width / 2,
        s.pos.y + this.height / 2,
        5, // radious
        0, 2 * Math.PI // full circle
      );
    }
    this.ctx.stroke();

    if ( this.running ) {
      requestAnimationFrame(this.drawOnCanvas.bind(this));
    }
  }

  ngOnDestroy() {
    // subscription is in ngOnInit
    this.sub.unsubscribe();
    this.wss.send( new LeaveTheRoomMsg(this.roomid) );
    this.running = false;
    console.log( 'leaving gameplay' );
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

  private currentUnixTimeMs() {
    return new Date().getTime();
  }

  /**
   * This will trigger ngOnDestroy
   */
  onLeaveRoomButtonClick( ) {
    // TODO: prefefine routes as constants
    this.router.navigate( ['./roomlist'] );
  }

  onKeyDown( e: KeyboardEvent ) {
    // escape key repetition
    if ( this.keysWhichArePressed.has(e.code) ) {
      return;
    } else {
      this.keysWhichArePressed.add( e.code );
    }
    const timestamp = this.currentUnixTimeMs();
    switch ( e.code ) {
      case 'ArrowLeft': this.player.applyEvent( new GameEvent(timestamp, GameEventType.TURN_LEFT) ); break;
      case 'ArrowRight': this.player.applyEvent( new GameEvent(timestamp, GameEventType.TURN_RIGHT) ); break;
    }
    // console.log( `${e.code} down` );
  }

  onKeyUp( e: KeyboardEvent ) {
    this.keysWhichArePressed.delete( e.code );
    const timestamp = this.currentUnixTimeMs();
    switch ( e.code ) {
      case 'ArrowLeft': this.player.applyEvent( new GameEvent(timestamp, GameEventType.STR8_FORWARD) ); break;
      case 'ArrowRight': this.player.applyEvent( new GameEvent(timestamp, GameEventType.STR8_FORWARD) ); break;
    }
    // console.log( `${e.code} up` );
  }

  onBlur( e: FocusEvent) {
    console.log( 'onBlur' );
  }

  onFocus( e: FocusEvent ) {
    console.log( 'onFocus' );
  }

}
