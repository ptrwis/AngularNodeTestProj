export class Vec2d{

    constructor( public x: number, public y: number) {

    }

    copy() { return new Vec2d(this.x, this.y) }

    add( v: Vec2d ): Vec2d {
        return new Vec2d( this.x + v.x, this.y + v.y );
    }

    mul( s: number ) {
        return new Vec2d( this.x * s, this.y * s );
    }

    sub( v: Vec2d ): Vec2d {
        return this.add( v.mul(-1));
    }

    div( s: number ) {
        return this.mul( 1/s );
    }

    dot( v: Vec2d): number{
        return this.x * v.x + this.y * v.y;
    }

    dist( v2: Vec2d ) {
        return ((this.x - v2.x)**2 + (this.y - v2.y)**2)**0.5;
    }
    
    angleBetween( v: Vec2d) : number {
        // return Math.acos( this.normalize().dot(v.normalize()) );
        return this.sub(v).angle();
    }
    
    angle() : number{
        const angle: number = Math.acos( this.x / this.length() );
        return this.y > 0 ? angle : 2 * 3.1416 - angle;
    }
    
    normal(): Vec2d {
        return new Vec2d( - this.y, this.x).normalize();
    }
    
    length(): number {
        return Math.sqrt( this.x * this.x + this.y * this.y );
    }
    
    normalize(): Vec2d{
        return this.div( this.length());
    }

    rot( radians: number ){
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        return new Vec2d( 
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    rotAround( radians: number, anchor: Vec2d ) {
        return this.sub( anchor ).rot( radians ).add( anchor );
    }

}