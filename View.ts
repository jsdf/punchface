import {Vec2d} from "./Vec2d";
import {Vec3d} from "./Vec3d";
import {GameObject} from "./GameObject";

const SCALE = 1;

export class View {
  static VIEWBOX_PADDING_PCT = 20;
  offset = new Vec2d();
  toScreen(v: Vec2d) {
    return v
      .clone()
      .mulScalar(SCALE)
      .sub(this.offset);
  }
  fromScreen(v: Vec2d) {
    return v
      .clone()
      .add(this.offset)
      .divScalar(SCALE);
  }

  getScreenPos(pos: Vec3d) {
    const rel = this.getScreenSpacePosition(pos);
    // apply scrolling
    return this.toScreen(rel);
  }

  getScreenSpacePosition(pos: Vec3d) {
    return new Vec2d({
      x: Math.floor(pos.x),
      y: -Math.floor(pos.y + pos.z / 2)
    });
  }

  update(playerPos3d: Vec3d, viewWidth: number, viewHeight: number) {
    const playerPosScr = new Vec2d(this.getScreenSpacePosition(playerPos3d));
    this.offset.x += View.calculateViewAdjustmentForDimension(
      this.offset.x,
      viewWidth,
      playerPosScr.x
    );
    this.offset.y += View.calculateViewAdjustmentForDimension(
      this.offset.y,
      viewHeight,
      playerPosScr.y
    );
  }

  static calculateViewAdjustmentForDimension(
    // arguments are scalar values along the relevant dimension
    offset: number,
    viewportSize: number,
    playerPos: number
  ) {
    /*
        plr
      box|
   scr | |
    |  | |   
    v  v |   
    |  | v   
    |  | x   
 
    boxAbs = scrOff+boxRel
    if (plr - boxAbs < 0), scrOff -= plr - boxAbs
     */
    const percentPaddingSize = Math.floor(
      viewportSize * (View.VIEWBOX_PADDING_PCT / 100)
    );
    const boxMinAbs = offset + percentPaddingSize;
    const boxMaxAbs = offset + viewportSize - percentPaddingSize;

    const deltaMin = Math.min(playerPos - boxMinAbs, 0);
    const deltaMax = -Math.min(boxMaxAbs - playerPos, 0);

    const delta = deltaMin === 0 ? deltaMax : deltaMin;
    return delta;
  }
}
