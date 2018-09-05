// import { LocalGame } from '../../../../../common/game/game';
/**
 * Draw game using HTML Canvas
 */
class CanvasRender {

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    // private game: LocalGame
  ) {
  }

  /**
   *
   * @param time - total game time in ms
   */
  draw( time: number) {
    // think about if this is the right place to update physics
    // and do we even need to update it
  }

}
