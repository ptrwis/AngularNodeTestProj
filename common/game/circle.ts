import { Vec2d } from "./vec2d";
import { Shape } from "./shape";

export class Circle implements Shape {
    constructor( public center: Vec2d,
                 public radious: number) {
    }
    copy() { return new Circle(this.center.copy(), this.radious); }
}