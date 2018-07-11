import { Vec2d } from "./vec2d";

export class Game{

    players: Set<Player>;

}

class Player{
    
    time: number;
    pos: Vec2d;
    dir: Vec2d;

}