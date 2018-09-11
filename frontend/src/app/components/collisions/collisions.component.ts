import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Segment, Curve } from '../../../../../common/game/game';
import { Vec2d } from '../../../../../common/game/vec2d';

@Component({
    selector: 'collisions',
    template: `
    <h3>testing collisions</h3>
    <div>
        <p-slider [(ngModel)]="rangeValues" [range]="true" [min]="0" [max]="rangeMax" ></p-slider>
        <select>
            <option>curve</option>
            <option>segment</option>
        </select>
        <select>
            <option>move</option>
            <option>rotate</option>
        </select>
    </div>
    <canvas #kanvaz>
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

    rangeMax = Math.PI * 4;
    rangeValues: number[] = [0, Math.PI * 2];

    segment: Segment;
    curve: Curve;

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
        this.segment = new Segment(new Vec2d(20, 20), new Vec2d(500, 20));
        this.curve = new Curve(
            new Vec2d(this.width / 2, this.height / 2),
            100,
            this.rangeValues[0], this.rangeValues[1]
        );
    }

    private drawOnCanvas() {
        this.clearScreen();
        this.drawLine(this.segment);
        this.drawCurve(this.curve);
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

}
