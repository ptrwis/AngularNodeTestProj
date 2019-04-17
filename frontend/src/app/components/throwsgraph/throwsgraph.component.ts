import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Vec2d } from '../../../../../common/game/vec2d';
import { g, Throw } from '../../../../../common/game/Throw';
import { CanvasRenderer } from '../renderer/canvas.renderer';
import { Segment } from '../../../../../common/game/segment';

@Component({
    selector: 'throwsgraph',
    template: `
    <h3>testing collisions</h3>
    <div>
        <div>
            <input type="radio" name="throw" value="throw1" [(ngModel)]="selectedThrow" /> throw1
            <input type="radio" name="throw" value="throw2" [(ngModel)]="selectedThrow" /> throw2
        </div>
    </div>
    <canvas #kanvax
            (mousedown)="handleMouseDown($event)"
            (mouseup)="handleMouseUp($event)"
            (mousemove)="handleMouseMove($event)" >
    </canvas>
    `,
})
export class ThrowsgraphComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('kanvax') canvasRef: ElementRef;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    @Input() public width = 640;
    @Input() public height = 480;
    isRunning = true;
    dragging = false;
    mouse: Vec2d;
    selectedThrow = 'throw1';
    throw1: Throw;
    throw2: Throw;

    renderer: CanvasRenderer;

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.canvas = this.canvasRef.nativeElement;
        this.ctx = this.canvas.getContext('2d');
        this.renderer = new CanvasRenderer(this.canvas, this.ctx, this.width, this.height);
        // this.ctx.fillStyle = '#000000';
        // this.ctx.strokeStyle = '#ffffff';
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

        this.throw1 = new Throw(
            new Vec2d(w2 - 40, h2),
            new Vec2d( 1.0, -1.0),
            50.0,
            20, // radious
            0   // time of throw
        );

        this.throw2 = new Throw(
            new Vec2d(w2 + 40, h2),
            new Vec2d( -1.0, -1.0),
            50.0,
            10, // radious
            0   // time of throw
        );
    }

    handleMouseDown( m: MouseEvent ) {
        this.dragging = true;
        this.mouse = new Vec2d(
            m.x - this.canvas.getBoundingClientRect().left,
            m.y - this.canvas.getBoundingClientRect().top
        );
        switch ( this.selectedThrow ) {
            case 'throw1': {
                const sub = this.mouse.sub(this.throw1.pos);
                this.throw1.v0 = sub.length() ;
                this.throw1.dir = sub.normalize();
            } break;
            case 'throw2': {
                const sub = this.mouse.sub(this.throw2.pos);
                this.throw2.v0 = sub.length() ;
                this.throw2.dir = sub.normalize();
            } break;
        }
    }
    handleMouseUp( m: MouseEvent ) {
        this.dragging = false;
    }
    handleMouseMove( m: MouseEvent ) {
        if ( this.dragging === true ) {
            this.handleMouseDown( m );
        }
    }

    private drawOnCanvas() {
        this.ctx.fillStyle = '#000000';
        this.ctx.lineWidth = 6;
        this.renderer.clearScreen();

        this.ctx.strokeStyle = '#00ff00';
        this.renderer.drawThrow( this.throw1 );
        this.ctx.strokeStyle = '#ff0000';
        this.renderer.drawSegment( new Segment(
            this.throw1.pos,
            this.throw1.pos.add(this.throw1.dir.mul(this.throw1.v0))
        ) );

        this.ctx.strokeStyle = '#0000ff';
        this.renderer.drawThrow( this.throw2 );
        this.ctx.strokeStyle = '#ff0000';
        this.renderer.drawSegment( new Segment(
            this.throw2.pos,
            this.throw2.pos.add(this.throw2.dir.mul(this.throw2.v0))
        ) );
        
        this.ctx.lineWidth = 2;
        const t = this.throw1.solve(this.throw2);
        if ( t !== undefined ) {
            this.ctx.strokeStyle = '#aaffaa';
            this.renderer.drawCircle(
                this.throw1.count(t),
                this.throw1.r
            );
            this.ctx.strokeStyle = '#aaaaff';
            this.renderer.drawCircle(
                this.throw2.count(t),
                this.throw2.r
            );
        }

        if (this.isRunning) {
            requestAnimationFrame(this.drawOnCanvas.bind(this));
        }
    }

}
