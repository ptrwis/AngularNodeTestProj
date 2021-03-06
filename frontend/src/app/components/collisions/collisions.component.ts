import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Vec2d } from '../../../../../common/game/vec2d';
import { Shape } from '../../../../../common/game/shape';
import { Segment } from '../../../../../common/game/segment';
import { Curve } from '../../../../../common/game/curve';
import { intersectionCurveCurve,
         intersectionCurveSegment,
         intersectionSegmentSegment } from '../../../../../common/game/intersections';
import { CanvasRenderer } from '../renderer/canvas.renderer';

@Component({
    selector: 'collisions',
    template: `
    <h3>testing collisions</h3>
    <div>
        <div>
            <input type="radio" name="shape" value="curve"   [(ngModel)]="selectedShape" /> curve
            <input type="radio" name="shape" value="segment" [(ngModel)]="selectedShape" /> segment
        </div>
        <br />
        <div>
            <input type="radio" name="transf" value="move"   [(ngModel)]="selectedTransformation" /> move
            <input type="radio" name="transf" value="rotate" [(ngModel)]="selectedTransformation" /> rotate
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

    segment1: Segment;
    segment2: Segment;
    curve1: Curve;
    curve2: Curve;

    renderer: CanvasRenderer;

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.canvas = this.canvasRef.nativeElement;
        this.ctx = this.canvas.getContext('2d');
        this.renderer = new CanvasRenderer(this.canvas, this.ctx, this.width, this.height);
        this.ctx.fillStyle = '#000000';
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 6;
        this.renderer.clearScreen();
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
            0.7 * 2 * Math.PI, 0.3 * 2 * Math.PI
        );
        this.curve2 = new Curve(
            new Vec2d(w2, 0.55 * h),
            100,
            0.3 * 2 * Math.PI, 0.7 * 2 * Math.PI
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
    handleMouseUp( m: MouseEvent ) {
        this.dragging = false;
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
        this.renderer.clearScreen();

        this.ctx.strokeStyle = '#ff44ff';
        this.segment1 = this.rotate(this.segment1, 0.01);
        this.renderer.drawSegment( this.segment1 );

        this.ctx.strokeStyle = '#ffff22';
        this.segment2 = this.rotate(this.segment2, -0.01);
        this.renderer.drawSegment( this.segment2 );

        this.ctx.strokeStyle = '#ffffff';
        this.curve1.center = this.curve1.center.rotAround( 0.01, new Vec2d(this.width / 2, this.height / 2) );
        this.renderer.drawCurve(this.curve1);
        this.ctx.strokeStyle = '#00ffff';
        this.curve2.center = this.curve2.center.rotAround( -0.01, new Vec2d(this.width / 2, this.height / 2) );
        this.renderer.drawCurve(this.curve2);

        this.ctx.strokeStyle = '#3333ff';
        intersectionCurveSegment(this.curve1, this.segment1).forEach( p => this.renderer.drawCircle(p, 10)  );
        intersectionCurveSegment(this.curve1, this.segment2).forEach( p => this.renderer.drawCircle(p, 10)  );
        intersectionCurveSegment(this.curve2, this.segment1).forEach( p => this.renderer.drawCircle(p, 10)  );
        intersectionCurveSegment(this.curve2, this.segment2).forEach( p => this.renderer.drawCircle(p, 10)  );

        this.ctx.strokeStyle = '#00ff00';
        intersectionCurveCurve( this.curve1, this.curve2 ).forEach( p => this.renderer.drawCircle(p, 10)  );

        this.ctx.strokeStyle = '#ff0000';
        intersectionSegmentSegment( this.segment1, this.segment2 ).forEach( p => this.renderer.drawCircle(p, 10)  );

        if (this.isRunning) {
            requestAnimationFrame(this.drawOnCanvas.bind(this));
        }
    }

}
