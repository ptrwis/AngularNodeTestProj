import { Segment } from '../../../../../common/game/segment';
import { Curve } from '../../../../../common/game/curve';
import { Vec2d } from '../../../../../common/game/vec2d';

export interface Renderer {
    clearScreen();
    drawSegment(segment: Segment);
    drawCurve(curve: Curve);
    drawCircle(pos: Vec2d, r: number);
}
