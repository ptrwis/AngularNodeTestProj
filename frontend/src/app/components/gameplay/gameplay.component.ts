import { Vec2d } from '../../../../../common/game/vec2d';
import { Component, OnInit, AfterViewInit, ViewChild, Input, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketService } from '../../services/webosocket.service';
import { SimplePlayer, PlayerState, GameEvent, GameEventType } from '../../../../../common/game/game';
import { LeaveTheRoomCmd } from '../../../../../common/protocol/leave_room';

@Component({
  selector: 'gameplay',
  template:
  `<h3>GamePlay {{roomid}}</h3>

  <button (click)="resetPlayer()" >reset player</button>
  <br />
  <button (click)="clearScreen()" >clear</button>
  <br />
  <button (click)="onLeaveRoomButtonClick()" >Leave</button>
  <br />
  <canvas #kanvas tabindex="1"
                  (keydown)="onKeyDown($event)"
                  (keyup)="onKeyUp($event)"
                  (blur)="onBlur($event)"
                  (focus)="onFocus($event)" >
  </canvas>

  <!--
  <h4>Click on the owls to make them flying!</h4>
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
  -->
  `,
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
  keyboardMap: Map <string, GameEventType>;

  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.roomid = +params['id']; // (+) converts string 'id' to a number
    });
    this.keysWhichArePressed = new Set();
    this.player = new SimplePlayer(
      new PlayerState(
        new Vec2d(this.width / 2, this.height / 2),
        new Vec2d(1, 0)
      ),
      new GameEvent( this.currentUnixTimeMs(), GameEventType.STR8_FORWARD)
    );
    this.keyboardMap = new Map();
    this.keyboardMap.set( 'ArrowLeft', GameEventType.TURN_LEFT );
    this.keyboardMap.set( 'ArrowRight', GameEventType.TURN_RIGHT );
    // this.keyboardMap.set( 'ArrowUp', GameEventType.STR8_FORWARD );
  }

  public ngAfterViewInit() {
    // get the context
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    // set the width and height
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx.fillStyle = '#000000';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#FFFF00';
    this.ctx.shadowBlur = 5;
    // this.ctx.shadowOffsetX = 10;
    // this.ctx.lineCap = 'round';
    this.clearScreen();
    this.drawOnCanvas();
  }

  private drawOnCanvas() {
    const timestamp = this.currentUnixTimeMs();
    this.clearScreen();
    this.drawPlayer( this.currentUnixTimeMs() );
    if ( this.running ) {
      requestAnimationFrame(this.drawOnCanvas.bind(this));
    }
  }

  /**
   *
   */
  clearScreen() {
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   *
   * @param timestamp
   */
  drawPlayer( timestamp: number ) {
    const p = this.player;
    const old = p.state;
    const cur = this.player.getCurrentState( timestamp );
    const dt = this.currentUnixTimeMs() - p.lastEvent.time;

    switch ( this.player.lastEvent.eventType ) {

      case GameEventType.STR8_FORWARD: {
        this.drawLine(old.pos, cur.pos);
        this.drawCircleAt( cur.pos );
      } break;

      case GameEventType.TURN_RIGHT: {
        const cw = false;
        const center = p.centerOfRotation( GameEventType.TURN_RIGHT );
        this.drawArc( old.pos, center, +p.w * dt, cw );
        this.drawCircleAt( cur.pos );
      } break;

      case GameEventType.TURN_LEFT: {
        const cw = true;
        const center = p.centerOfRotation( GameEventType.TURN_LEFT );
        this.drawArc( old.pos, center, -p.w * dt, cw );
        this.drawCircleAt( cur.pos );
      } break;

    }
  }

  drawArc( point: Vec2d, center: Vec2d, angle: number, cw: boolean ) {
    const angleStart = point.sub(center).angle();
    const angleEnd = angleStart + angle;
    this.ctx.beginPath();
    {
      this.ctx.arc(
        center.x, center.y,
        this.player.radious, // radious
        angleStart, angleEnd,
        cw
      );
    }
    this.ctx.stroke();
  }

  drawLine( start: Vec2d, end: Vec2d ) {
    this.ctx.beginPath();
    {
      this.ctx.moveTo( start.x, start.y);
      this.ctx.lineTo( end.x, end.y);
    }
    this.ctx.stroke();
  }

  /**
   *
   * @param pos world (x,y) are screen's (x,y)
   */
  drawCircleAt( pos: Vec2d ) {
    this.ctx.beginPath();
    {
      this.ctx.arc(
        pos.x, pos.y,
        5, // radious
        0, 2 * Math.PI // full circle
      );
    }
    this.ctx.stroke();
  }

  ngOnDestroy() {
    // subscription is in ngOnInit
    this.sub.unsubscribe();
    this.wss.send( new LeaveTheRoomCmd(this.roomid) );
    this.running = false;
    console.log( 'leaving gameplay' );
  }

  resetPlayer() {
    this.player = new SimplePlayer(
      new PlayerState(
        new Vec2d(this.width / 2, this.height / 2),
        new Vec2d(1, 0)
      ),
      new GameEvent( this.currentUnixTimeMs(), GameEventType.STR8_FORWARD)
    );
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

  /**
   * TODO: this.keyboardMap
   * TODO2(?): unify onKeyUp and onKeyDown, move logic of both to the game, eg. onKeyUp -> game.goForward()
   * @param e
   */
  onKeyDown( e: KeyboardEvent ) {
    // escape key repetition
    if ( this.keysWhichArePressed.has(e.code) ) {
      return;
    }
    this.keysWhichArePressed.add(e.code);

    const timestamp = this.currentUnixTimeMs();
    const gameEvent = this.keyboardMap.get(e.code);
    this.player.applyEvent( new GameEvent(timestamp, gameEvent ));
    /* switch ( e.code ) {
      case 'ArrowLeft': this.player.applyEvent( new GameEvent(timestamp, GameEventType.TURN_LEFT) ); break;
      case 'ArrowRight': this.player.applyEvent( new GameEvent(timestamp, GameEventType.TURN_RIGHT) ); break;
    } */
    // console.log( `${e.code} down` );
  }

  onKeyUp( e: KeyboardEvent ) {
    this.keysWhichArePressed.delete( e.code );
    const timestamp = this.currentUnixTimeMs();
    // a case when eg player pressed 'left', then 'right', then released 'left' but still holding 'right'
    if ( this.keysWhichArePressed.size === 0 ) {
      this.player.applyEvent( new GameEvent(timestamp, GameEventType.STR8_FORWARD) );
      return;
    }
    // eg player pressed 'left', then 'right', then released 'right' but still holding 'left' - we have to (re)submit 'left' again
    // TODO: maybe resubmit the last one pressed, here it is the random one, but in the case of this game it's enough
    const someKeyStillBeingPressed = this.keysWhichArePressed.values().next().value;

    const gameEvent = this.keyboardMap.get(someKeyStillBeingPressed);
    if ( this.player.lastEvent.eventType !== gameEvent ) {
      this.player.applyEvent( new GameEvent(timestamp, gameEvent) );
    }

    /*
    switch ( someKeyStillBeingPressed ) {
      case 'ArrowLeft':
        if ( this.player.lastEvent.eventType !== GameEventType.TURN_LEFT ) {
          this.player.applyEvent( new GameEvent(timestamp, GameEventType.TURN_LEFT) );
        }
        break;
      case 'ArrowRight':
        if ( this.player.lastEvent.eventType !== GameEventType.TURN_RIGHT ) {
          this.player.applyEvent( new GameEvent(timestamp, GameEventType.TURN_RIGHT) );
        }
        break;
    }
    */
  }

  onBlur( e: FocusEvent) {
    console.log( 'onBlur' );
  }

  onFocus( e: FocusEvent ) {
    console.log( 'onFocus' );
  }

}
