import { Segment } from '../../../../../common/game/segment';
import { Curve } from '../../../../../common/game/curve';
import { Vec2d } from '../../../../../common/game/vec2d';
import { Renderer } from './renderer.interface';
import { Throw } from '../../../../../common/game/throw';

/**
 * Draw game using HTML Canvas
 */
export class CanvasRenderer implements Renderer {

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.fillStyle = '#000000';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 6;
    this.clearScreen();
  }

  clearScreen() {
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawSegment(segment: Segment) {
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
        curve.angleStart, curve.angleEnd
      );
    }
    this.ctx.stroke();
  }

  drawCircle(pos: Vec2d, r: number) {
    this.ctx.beginPath();
    {
      this.ctx.arc(
        pos.x, pos.y,
        r, // radious
        0, 2 * Math.PI // full circle
      );
    }
    this.ctx.stroke();
  }

  drawThrow( t: Throw ) {
    const step = 1;
    for (let i = step; i < 50; i += step ) {
      this.drawSegment(
        new Segment(
          t.count(i - step),
          t.count(i),
        )
      );
    }
  }

}
