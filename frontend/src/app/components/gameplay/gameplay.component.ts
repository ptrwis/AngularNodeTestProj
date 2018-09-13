import { Vec2d } from '../../../../../common/game/vec2d';
import { Component, OnInit, AfterViewInit, ViewChild, Input, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketService } from '../../services/webosocket.service';
import { SimplePlayer, PlayerState, GameEvent, GameEventType, BRUSH_STATE } from '../../../../../common/game/game';
import { LeaveTheRoomCmd } from '../../../../../common/protocol/leave_room';
import { ClickCounter } from './click_counter';
import { Shape } from '../../../../../common/game/shape';
import { Segment } from '../../../../../common/game/segment';
import { Curve } from '../../../../../common/game/curve';

@Component({
  selector: 'gameplay',
  template:
  `<h3>GamePlay {{roomid}}</h3>

  <button (click)="resetPlayer()" >reset player</button>
  <button (click)="onLeaveRoomButtonClick()" >Quit</button>
  <br />
  clicks per second {{clicksPerSecond}}
  <br />
  number of shapes: {{player.shapes.length+1}}
  <br />
  <canvas #kanvas tabindex="1"
                  (keydown)="onKeyDown($event)"
                  (keyup)="onKeyUp($event)"
                  (blur)="onBlur($event)"
                  (focus)="onFocus($event)" >
  </canvas>
  <ul>TODO:
    <li>gaps</li>
    <li>collisions</li>
    <li>multiplayer</li>
  </ul>

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

  @ViewChild('kanvas') canvasRef: ElementRef;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  @Input() public width = 640;
  @Input() public height = 480;
  keysWhichArePressed: Set<string>;
  player: SimplePlayer;
  isRunning = true; // to request next animation frame or not
  keyboardMap: Map <string, GameEventType>;
  roomid: number;
  private sub: any; // subscription to route's parameters change
  clickCounter: ClickCounter;
  clicksPerSecond = 0;

  constructor(
    private wss: WebsocketService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.clickCounter = new ClickCounter();
    this.player = new SimplePlayer(
      new PlayerState( new Vec2d(this.width / 2, this.height / 2), new Vec2d(1, 0) ),
      new GameEvent( this.currentUnixTimeMs(), GameEventType.STR8_FORWARD)
    );
    this.keysWhichArePressed = new Set();
    this.keyboardMap = new Map();
    this.keyboardMap.set( 'ArrowLeft', GameEventType.TURN_LEFT );
    this.keyboardMap.set( 'ArrowRight', GameEventType.TURN_RIGHT );
    // this.keyboardMap.set( 'ArrowUp', GameEventType.STR8_FORWARD );
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.roomid = +params['id']; // (+) converts string 'id' to a number
    });
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
    this.ctx.lineWidth = 6;
    // this.ctx.lineCap = 'round';
    // this.ctx.shadowColor = '#FF0000';
    // this.ctx.shadowBlur = 1;
    // this.ctx.shadowOffsetX = 10;
    this.fireGap();
    this.drawOnCanvas();
  }

  private drawOnCanvas() {
    this.clearScreen();
    this.drawPlayer( );
    if ( this.isRunning ) {
      requestAnimationFrame(this.drawOnCanvas.bind(this));
    }
  }

  clearScreen() {
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  fireGap() {
    const GAP_START_AFTER = 500 + Math.random() * 3000;
    const GAP_STOP_AFTER = GAP_START_AFTER + 200; // constant duration
    // START
    window.setTimeout(
      () => this.player.applyEvent( new GameEvent( this.currentUnixTimeMs(), GameEventType.PULL) ),
      GAP_START_AFTER
    );
    // STOP
    window.setTimeout(
      () => {
        this.player.applyEvent( new GameEvent( this.currentUnixTimeMs(), GameEventType.PUSH));
        if ( this.isRunning ) {
          this.fireGap();
        }
      },
      GAP_STOP_AFTER
    );
  }

  drawPlayer( ) {
    const p = this.player;
    const shapesToDraw = [ ... p.shapes ];
    const lastShape = p.lastShape( this.currentUnixTimeMs() );
    if ( p.brushState === BRUSH_STATE.DOWN ) {
      shapesToDraw.push( lastShape );
    }
    shapesToDraw.forEach( shape => this.drawShape(shape) );

    const end = this.player.countState( p.lastState, this.currentUnixTimeMs() - p.lastMove.time, p.lastMove.eventType);
    this.drawCircleAt( end.pos );

  }

  drawShape( shape: Shape ) {
    if ( shape === undefined ) {
      return;
    }
    switch ( shape.constructor ) {
      case Segment: this.drawLine( shape as Segment ); break;
      case Curve: this.drawCurve( shape as Curve ); break;
    }
  }

  drawLine( segment: Segment) {
    this.ctx.beginPath();
    {
      this.ctx.moveTo( segment.start.x, segment.start.y);
      this.ctx.lineTo( segment.end.x, segment.end.y);
    }
    this.ctx.stroke();
  }

  drawCurve( curve: Curve ) {
    this.ctx.beginPath();
    {
      this.ctx.arc(
        curve.center.x, curve.center.y,
        curve.radious,
        curve.angleStart, curve.angleEnd
        // curve.angleEnd < curve.angleStart // ccw?
      );
    }
    this.ctx.stroke();
  }

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
    this.isRunning = false;
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

    this.clickCounter.inc();
    this.clicksPerSecond = this.clickCounter.getClicksPerSecond();

    const gameEvent = this.keyboardMap.get(e.code);
    if ( gameEvent === undefined ) {
      return;
    }
    this.player.applyEvent(
      new GameEvent(
        this.currentUnixTimeMs(),
        gameEvent
      )
    );
  }

  onKeyUp( e: KeyboardEvent ) {
    this.clickCounter.inc();
    this.clicksPerSecond = this.clickCounter.getClicksPerSecond();

    this.keysWhichArePressed.delete( e.code );
    const timestamp = this.currentUnixTimeMs();
    // a case when eg player pressed 'left', then 'right', then released 'left' but still holding 'right'
    if ( this.keysWhichArePressed.size === 0 ) {
      this.player.applyEvent( new GameEvent(timestamp, GameEventType.STR8_FORWARD) );
      return;
    }
    // eg player pressed 'left', then 'right', then released 'right' but still holding 'left' - we have to (re)submit 'left' again
    // TODO: maybe resubmit the last one pressed, here it is the random one, but in the case of this game it's enough
    const aKeyStillBeingPressed = this.keysWhichArePressed.values().next().value;

    const gameEvent = this.keyboardMap.get(aKeyStillBeingPressed);
    if ( this.player.lastMove.eventType !== gameEvent ) {
      this.player.applyEvent( new GameEvent(timestamp, gameEvent) );
    }
  }

  onBlur( e: FocusEvent) {
    console.log( 'onBlur' );
  }

  onFocus( e: FocusEvent ) {
    console.log( 'onFocus' );
  }

}
