import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Vec2d } from '../../../../../common/game/vec2d';
import { Throw } from '../../../../../common/game/throw';
import { CanvasRenderer } from '../renderer/canvas.renderer';
import { Segment } from '../../../../../common/game/segment';

/**
 * solve
 * sqrt(...) == r1 + r2
 * for t
 */
function solve( throw1: Throw, throw2: Throw ): Vec2d[] {
    const
        t0 = throw1.timestamp, t1 = throw2.timestamp, // czasy rzutow
        v0 = throw1.v0, v1 = throw2.v0,
        α = throw1.dir.angle(), β = throw2.dir.length(),
        g = 9.81,
        x0 = throw1.pos.x, y0 = throw1.pos.y,
        y1 = throw2.pos.y, x1 = throw2.pos.x,
        r0 = 1, r1 = 1; // we are throwing balls
    const
        sina = Math.sin(α),
        cosa = Math.cos(α),
        sinb = Math.sin(β),
        cosb = Math.cos(β);

    const X = 8*t1*v1**2*sinb**2+((-8*t1-8*t0)*v0*v1*sina-8*v1*y1+8*v1*y0+(12*g*t1**2-8*g*t0*t1-4*g*t0**2)*v1)*sinb+8*t1*v1**2*cosb**2+((-8*t1-8*t0)*v0*v1*cosa-8*v1*x1+8*v1*x0)*cosb+8*t0*v0**2*sina**2+(8*v0*y1-8*v0*y0+(-4*g*t1**2-8*g*t0*t1+12*g*t0**2)*v0)*sina+8*t0*v0**2*cosa**2+(8*v0*x1-8*v0*x0)*cosa+(8*g*t0-8*g*t1)*y1+(8*g*t1-8*g*t0)*y0+4*g**2*t1**3-4*g**2*t0*t1**2-4*g**2*t0**2*t1+4*g**2*t0**3;

    const Y =
        ( -8*t1*v1**2*sinb**2+((8*t1+8*t0)*v0*v1*sina+8*v1*y1-8*v1*y0+(-12*g*t1**2+8*g*t0*t1+4*g*t0**2)*v1)*sinb-8*t1*v1**2*cosb**2+((8*t1+8*t0)*v0*v1*cosa+8*v1*x1-8*v1*x0)*cosb-8*t0*v0**2*sina**2+(-8*v0*y1+8*v0*y0+(4*g*t1**2+8*g*t0*t1-12*g*t0**2)*v0)*sina-8*t0*v0**2*cosa**2+(8*v0*x0-8*v0*x1)*cosa+(8*g*t1-8*g*t0)*y1+(8*g*t0-8*g*t1)*y0-4*g**2*t1**3+4*g**2*t0*t1**2+4*g**2*t0**2*t1-4*g**2*t0**3 )**2  
        - 4
        * ( 4*v1**2*sinb**2+((8*g*t1-8*g*t0)*v1-8*v0*v1*sina)*sinb+4*v1**2*cosb**2-8*v0*v1*cosa*cosb+4*v0**2*sina**2+(8*g*t0-8*g*t1)*v0*sina+4*v0**2*cosa**2+4*g**2*t1**2-8*g**2*t0*t1+4*g**2*t0**2 ) 
        * ( 4*t1**2*v1**2*sinb**2+(-8*t0*t1*v0*v1*sina-8*t1*v1*y1+8*t1*v1*y0+(4*g*t1**3-4*g*t0**2*t1)*v1)*sinb+4*t1**2*v1**2*cosb**2+(-8*t0*t1*v0*v1*cosa-8*t1*v1*x1+8*t1*v1*x0)*cosb+4*t0**2*v0**2*sina**2+(8*t0*v0*y1-8*t0*v0*y0+(4*g*t0**3-4*g*t0*t1**2)*v0)*sina+4*t0**2*v0**2*cosa**2+(8*t0*v0*x1-8*t0*v0*x0)*cosa+4*y1**2+(-8*y0-4*g*t1**2+4*g*t0**2)*y1+4*y0**2+(4*g*t1**2-4*g*t0**2)*y0+4*x1**2-8*x0*x1+4*x0**2+g**2*t1**4-2*g**2*t0**2*t1**2+g**2*t0**4-4*r1**2-8*r0*r1-4*r0**2 );

    const  Z = 8*v1**2*sinb**2+((16*g*t1-16*g*t0)*v1-16*v0*v1*sina)*sinb+8*v1**2*cosb**2-16*v0*v1*cosa*cosb+8*v0**2*sina**2+(16*g*t0-16*g*t1)*v0*sina+8*v0**2*cosa**2+8*g**2*t1**2-16*g**2*t0*t1+8*g**2*t0**2;

    if ( Z === 0 ) { return []; }
    if ( Y < 0 ) { return []; }
    const result = [];
    const t_1 = ( X - Math.sqrt( Y ) ) / Z;
    const t_2 = ( X + Math.sqrt( Y ) ) / Z;
    if ( t_1 >= 0 ) { result.push( t_1 ); }
    if ( t_2 >= 0 ) { result.push( t_2 ); }
    return result;
}

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
    solutions = [];

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
            new Vec2d( 1.0, -1.0),
            50.0
        );
        this.throw1.timestamp = 0;

        this.throw2 = new Throw(
            new Vec2d(w2 + 20, h2),
            new Vec2d( -1.0, -1.0),
            50.0
        );
        this.throw2.timestamp = 0;
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
    handleMouseUp( ) {
        this.dragging = false;
        this.solutions = solve(this.throw1, this.throw2);
        console.log( this.solutions );
    }
    handleMouseMove( m: MouseEvent ) {
        if ( this.dragging === true ) {
            this.handleMouseDown( m );
        }
    }

    private drawOnCanvas() {
        this.ctx.fillStyle = '#000000';
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

        this.ctx.strokeStyle = '#ff0000';
        this.solutions.forEach( s => this.ctx.strokeRect(s.x, s.y, 2, 2) );

        if (this.isRunning) {
            requestAnimationFrame(this.drawOnCanvas.bind(this));
        }
    }

}
