import { Segment } from '../../../../../common/game/segment';
import { Curve } from '../../../../../common/game/curve';
import { Vec2d } from '../../../../../common/game/vec2d';

/**
 * Draw game using HTML Canvas
 */
export class CanvasRenderer {

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

  drawCircle(pos: Vec2d) {
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
