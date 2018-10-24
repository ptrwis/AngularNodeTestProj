import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Vec2d } from '../../../../../common/game/vec2d';
import { Throw } from '../../../../../common/game/throw';
import { CanvasRenderer } from '../renderer/canvas.renderer';
import { Segment } from '../../../../../common/game/segment';

@Component({
    selector: 'throwsgraph',
    template: `
    <h3>testing collisions</h3>
    <div>
        <div>
            <p-radioButton name="throw" value="throw1" [(ngModel)]="selectedThrow" label="throw1"> </p-radioButton>
            <p-radioButton name="throw" value="throw2" [(ngModel)]="selectedThrow" label="throw2"> </p-radioButton>
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

        this.throw1 = new Throw(
            new Vec2d(w2 - 20, h2),
            new Vec2d( 1.0, 1.0),
            10.0
        );
        this.throw2 = new Throw(
            new Vec2d(w2 + 20, h2),
            new Vec2d( -1.0, 1.0),
            10.0
        );
    }

    handleMouseDown( m: MouseEvent ) {
        this.dragging = true;
        this.mouse = new Vec2d(
            m.x - this.canvas.getBoundingClientRect().left,
            m.y - this.canvas.getBoundingClientRect().top
        );
        switch ( this.selectedThrow ) {
            case 'throw1':
                this.throw1.dir = this.mouse.sub(this.throw1.pos);
                this.throw1.v0 = this.throw1.dir.length() ;
                this.ctx.strokeRect( this.mouse.x, this.mouse.y, 2, 2 );
                break;
            case 'throw2':
                this.throw2.dir = this.mouse.sub(this.throw2.pos);
                this.throw2.v0 = this.throw2.dir.length() ;
                break;
        }
    }
    handleMouseUp( ) {
        this.dragging = false;
    }
    handleMouseMove( m: MouseEvent ) {
        if ( this.dragging === true ) {
            this.handleMouseDown( m );
        }
    }

    private drawOnCanvas() {
        this.ctx.fillStyle = '#000000';
        this.renderer.clearScreen();

        this.ctx.strokeStyle = '#ff11ff';
        this.renderer.drawThrow( this.throw1 );
        this.ctx.strokeStyle = '#ffccff';
        this.renderer.drawSegment( new Segment(
            this.throw1.pos,
            this.throw1.pos.add(this.throw1.dir)
        ) );

        this.ctx.strokeStyle = '#ffff11';
        this.renderer.drawThrow( this.throw2 );
        this.ctx.strokeStyle = '#ffffcc';
        this.renderer.drawSegment( new Segment(
            this.throw2.pos,
            this.throw2.pos.add(this.throw2.dir)
        ) );

        if (this.isRunning) {
            requestAnimationFrame(this.drawOnCanvas.bind(this));
        }
    }

}
