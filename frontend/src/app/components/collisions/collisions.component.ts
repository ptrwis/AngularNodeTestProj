import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Segment, Curve, Shape, Circle } from '../../../../../common/game/game';
import { Vec2d } from '../../../../../common/game/vec2d';

@Component({
    selector: 'collisions',
    template: `
    <h3>testing collisions</h3>
    <div>
        <p-slider   [(ngModel)]="rangeValues" [range]="true" [min]="0" [max]="rangeMax"
                    (onChange)="handleSliderChange($event)" >
        </p-slider>
        <br />
        {{rangeValues[0]}} - {{rangeValues[1]}} / {{dragging}}
        <br />
        <div>
            <p-radioButton name="shape" value="curve"   [(ngModel)]="selectedShape" label="curve"> </p-radioButton>
            <p-radioButton name="shape" value="segment" [(ngModel)]="selectedShape" label="segment"> </p-radioButton>
        </div>
        <br />
        <div>
            <p-radioButton name="transf" value="move"   [(ngModel)]="selectedTransformation" label="move"> </p-radioButton>
            <p-radioButton name="transf" value="rotate" [(ngModel)]="selectedTransformation" label="rotate"> </p-radioButton>
        </div>
    </div>
    <canvas #kanvaz
            (mousedown)="handleMouseDown($event)"
            (mouseup)="handleMouseUp($event)"
            (mousemove)="handleMouseMove($event)" >
    </canvas>
    `,
})
export class CollisionsComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('kanvaz') canvasRef: ElementRef;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    @Input() public width = 640;
    @Input() public height = 480;
    isRunning = true;
    dragging = false;
    mouse: Vec2d;
    savedShape: Shape;
    selectedTransformation = 'move';
    selectedShape = 'curve';

    rangeMax = 2 * 360;
    rangeValues: number[] = [0, 360];

    segment1: Segment;
    segment2: Segment;
    curve1: Curve;
    curve2: Curve;

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.canvas = this.canvasRef.nativeElement;
        this.ctx = this.canvas.getContext('2d');
        // set the width and height
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx.fillStyle = '#000000';
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 6;
        this.clearScreen();
        this.drawOnCanvas();
    }

    ngOnDestroy(): void {
        this.isRunning = false;
    }

    constructor() {
        const w = this.width;
        const h = this.height;
        const w2 = w / 2;
        const h2 = h / 2;

        this.segment1 = new Segment( new Vec2d(0.1 * w, h2), new Vec2d(0.8 * w, h2));
        this.segment2 = new Segment( new Vec2d(0.2 * w2, h2), new Vec2d(0.9 * w2, h2));

        this.curve1 = new Curve(
            new Vec2d(w2, 0.25 * h),
            100,
            this.rangeValues[0], this.rangeValues[1]
        );
        this.curve2 = new Curve(
            new Vec2d(w2, 0.75 * h),
            100,
            this.rangeValues[0], this.rangeValues[1]
        );
    }

    handleSliderChange( event ) {
        this.curve1.angleStart = event.values[0] * Math.PI / 180;
        this.curve1.angleEnd = event.values[1] * Math.PI / 180;
    }

    handleMouseDown( m: MouseEvent ) {
        this.dragging = true;
        this.mouse = new Vec2d( m.x, m.y );
        switch ( this.selectedShape ) {
            case 'curve': this.savedShape = this.curve1.copy(); break;
            case 'segment': this.savedShape = this.segment1.copy(); break;
        }
    }
    handleMouseUp( ) {
        this.dragging = false;
        this.segment1.intersectionS( this.segment2 ).forEach( p => console.log(JSON.stringify(p))  );
    }
    handleMouseMove( m: MouseEvent ) {
        // todo: add 'move' method ?
        if ( this.dragging === true ) {
            const move = new Vec2d(m.x, m.y).sub(this.mouse);
            switch ( this.selectedShape ) {
                case 'curve':
                    this.curve1.center = (this.savedShape as Curve).center.add(move);
                    break;
                case 'segment':
                    this.segment1.start = (this.savedShape as Segment).start.add(move);
                    this.segment1.end = (this.savedShape as Segment).end.add(move);
                    break;
            }
            // rotate only segment
            // switch ( selectedTransformation ) { case 'move': break; case 'rotate': break; }
        }
    }

    rotate(s: Segment, angle) {
        const center = s.start.add(s.end).mul(0.5);
        return new Segment(
            s.start.rotAround(angle, center),
            s.end.rotAround(angle, center)
        );
    }

    private drawOnCanvas() {
        this.clearScreen();

        this.ctx.strokeStyle = '#ff44ff';
        this.segment1 = this.rotate(this.segment1, 0.01);
        this.drawLine( this.segment1 );

        this.ctx.strokeStyle = '#ffff22';
        this.segment2 = this.rotate(this.segment2, -0.01);
        this.drawLine( this.segment2 );

        this.ctx.strokeStyle = '#ffffff';
        this.curve1.center = this.curve1.center.rotAround( 0.01, new Vec2d(this.width / 2, this.height / 2) );
        this.drawCurve(this.curve1);
        this.curve2.center = this.curve2.center.rotAround( -0.01, new Vec2d(this.width / 2, this.height / 2) );
        this.drawCurve(this.curve2);

        this.ctx.strokeStyle = '#3333ff';
        this.curve1.intersectionS( this.segment1 ).forEach( p => this.drawCircleAt(p)  );
        this.curve1.intersectionS( this.segment2 ).forEach( p => this.drawCircleAt(p)  );
        this.curve2.intersectionS( this.segment1 ).forEach( p => this.drawCircleAt(p)  );
        this.curve2.intersectionS( this.segment2 ).forEach( p => this.drawCircleAt(p)  );

        this.ctx.strokeStyle = '#00ff00';
        this.curve1.intersectionC( this.curve2 ).forEach( p => this.drawCircleAt(p)  );

        this.ctx.strokeStyle = '#ff0000';
        this.segment1.intersectionS( this.segment2 ).forEach( p => this.drawCircleAt(p)  );

        if (this.isRunning) {
            requestAnimationFrame(this.drawOnCanvas.bind(this));
        }
    }

    clearScreen() {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLine(segment: Segment) {
        this.ctx.beginPath();
        {
            this.ctx.moveTo(segment.start.x, segment.start.y);
            this.ctx.lineTo(segment.end.x, segment.end.y);
        }
        this.ctx.stroke();
    }

    drawCurve(curve: Curve) {
        this.ctx.beginPath();
        {
            this.ctx.arc(
                curve.center.x, curve.center.y,
                curve.radious,
                curve.angleStart, curve.angleEnd,
                curve.angleEnd < curve.angleStart // ccw?
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

}
