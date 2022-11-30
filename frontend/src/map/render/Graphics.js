import {
  Raster,
  Path,
  PointText,
  Color,
  Segment,
  Size,
} from "paper/dist/paper-full";

import Point from "../geom/Point";
import Shop from "../data/Shop";
import District from "../building/District";
import Model from "map/building/Model";

/**
 * This is a layer on top of the Paper JS rendering library.
 * Anything to do with drawing something to canvas goes here.
 * Initially all rendering is held until all objects are ordered properly within toDraw.
 * Then when renderBuffer is called all prepared objects are drawn to canvas.
 */

export default class Graphics {
  static JOIN_MITER = "miter";
  static JOIN_ROUND = "round";
  static JOIN_BEVEL = "bevel";

  static JOIN_DEFAULT = Graphics.JOIN_MITER;

  static CAP_ROUND = "round";
  static CAP_SQUARE = "square";
  static CAP_BUTT = "butt";

  static CAP_DEFAULT = Graphics.CAP_SQUARE;

  static SHADOW_OFFSET;

  static DRAW_CURVY_POLYGON = "DRAW_CURVY_POLYGON";
  static DRAW_POLYGON = "DRAW_POLYGON";
  static DRAW_SHOP = "DRAW_SHOP";

  fill = new Color(0, 0);
  fillAlpha = 1;
  lineThickness = 1;
  lineColor = new Color(0, 0);
  lineAlpha = 1;
  strokeJoin = Graphics.JOIN_DEFAULT;
  strokeCap = Graphics.CAP_DEFAULT;
  shadow = false;
  drawShadowsOnly = false;
  toDraw = [];
  holdRender = false;

  constructor(holdRender = false) {
    if (typeof Graphics.SHADOW_OFFSET == "undefined")
      Graphics.SHADOW_OFFSET = new Point(0, 5);
    this.holdRender = holdRender;
  }

  beginFill(color = "#000000", alpha = 1) {
    if (typeof color === "string" && color.charAt(0) == "#")
      this.fill = new Color(color);
    else if (typeof color === "number") this.fill = new Color(color, alpha);
    else if (color.charAt(0) === "r") this.fill = new Color(color);
    else throw "Unrecognized color";
  }

  drawCenteredRectangle(p1, width, height, angle = null) {
    const centeredPoint = new Point(p1.x - width / 2, p1.y - height / 2);
    const r = new Path.Rectangle(centeredPoint, new Size(width, height));
    r.fillColor = this.fill;
    r.strokeColor = this.lineColor;
    r.strokeWidth = this.lineThickness * 3;
    if (angle != null) r.rotate(-angle);
  }

  drawCircle(x, y, r) {
    const c = new Path.Circle(x, y, r);
    c.fillColor = this.fill;
    c.strokeColor = this.lineColor;
  }

  drawCurvyPolygon(p) {
    if (this.holdRender) {
      let g = new Graphics();
      g.fill = this.fill;
      g.lineColor = this.lineColor;
      g.strokeJoin = this.strokeJoin;
      g.strokeCap = this.strokeCap;
      g.lineThickness = this.lineThickness;
      this.toDraw.push({ g, p, m: Graphics.DRAW_CURVY_POLYGON });
      return;
    }
    const segs = p.map((x) => new Segment(x));
    segs.push(segs[0].clone());
    for (let i = 0; i < segs.length; i++) {
      const s0 = segs[i];
      const s1 = segs[(i + 1) % segs.length];
    }
    const c = new Path(segs);
    c.fillColor = this.fill;
    c.strokeColor = this.lineColor;
    c.strokeJoin = this.strokeJoin;
    c.strokeCap = this.strokeCap;
    c.strokeWidth = this.lineThickness * 3;
    c.scale(0.7);
    c.smooth({ type: "geometric", factor: 0.3 });
    if (this.shadow) {
      c.shadowColor = this.lineColor;
      c.shadowBlur = 0.5;
      c.shadowOffset = Graphics.SHADOW_OFFSET;
    }
  }

  drawRaster(image, position, scale) {
    const r = new Raster({
      source: image,
      position: position,
    });

    r.scale(scale);
  }

  drawLine(p1, p2) {
    const l = new Path.Line(p1, p2);
    l.strokeColor = this.lineColor;
    l.lineColor = this.lineColor;
    l.strokeJoin = this.strokeJoin;
    l.strokeCap = this.strokeCap;
    l.strokeWidth = 2;
  }

  drawLineCapHider(p) {
    const size = this.lineThickness * 5;
    const c = new Path.Rectangle(
      new Point(p.x - size / 2, p.y - size / 2),
      new Size(size, size)
    );
    c.fillColor = this.fill;
    c.strokeColor = this.lineColor;
  }

  drawPolygon(p) {
    if (this.holdRender) {
      let g = new Graphics();
      g.fill = this.fill;
      g.lineColor = this.lineColor;
      g.strokeJoin = this.strokeJoin;
      g.strokeCap = this.strokeCap;
      g.lineThickness = this.lineThickness;
      this.toDraw.push({ g, p, m: Graphics.DRAW_POLYGON });
      return;
    }
    const segs = p.map((x) => new Segment(x));
    const c = new Path(segs);
    c.fillColor = this.fill;
    c.strokeColor = this.lineColor;
    c.strokeJoin = this.strokeJoin;
    c.strokeCap = this.strokeCap;
    c.strokeWidth = this.lineThickness * 3;
    c.cent = p.center;

    if (this.shadow) {
      //shadows aren't real shops
      c.fillColor = "black";
      c.shadowColor = this.lineColor;
      c.shadowBlur = 0.5;
      c.shadowOffset = Graphics.SHADOW_OFFSET;
    }
  }

  drawPolyline(p, smooth = false) {
    const segs = p.map((x) => new Segment(x));
    const c = new Path(segs);
    c.fillColor = this.fill = new Color(0, 0, 0, 0);
    c.strokeColor = this.lineColor;
    c.strokeJoin = this.strokeJoin;
    c.strokeCap = this.strokeCap;
    c.strokeWidth = this.lineThickness;
    if (smooth) c.smooth();
  }

  drawShop(p, patch, shopData = null) {
    if (this.holdRender) {
      let g = new Graphics();
      g.fill = this.fill;
      g.lineColor = this.lineColor;
      g.strokeJoin = this.strokeJoin;
      g.strokeCap = this.strokeCap;
      g.lineThickness = this.lineThickness;
      this.toDraw.push({ g, p, patch, m: Graphics.DRAW_SHOP });
      return;
    }
    const segs = p.map((x) => new Segment(x));
    const s = new Shop(segs, shopData);

    patch.district && patch.district.replace(patch, s);

    s.fillColor = this.fill;
    s.strokeColor = this.lineColor;
    s.strokeJoin = this.strokeJoin;
    s.strokeCap = this.strokeCap;
    s.strokeWidth = this.lineThickness * 3;

    s.center = p.centroid;

    s.patch = patch;
    s.initShop();
    patch.shop = s;
  }

  drawText(x, y, text) {
    let t = new PointText(new Point(x, y));
    t.justification = "center";
    t.fillColor = "#FF0000";
    t.content = text;
    t.fontSize = 20;
  }

  endFill() {
    this.fillColor = new Color(0, 0);
  }

  lineStyle(
    thickness,
    color,
    joinStyle = Graphics.JOIN_DEFAULT,
    capStyle = Graphics.CAP_DEFAULT
  ) {
    this.lineThickness = thickness;
    this.lineColor = new Color(color);
    this.strokeJoin = joinStyle;
    this.strokeCap = capStyle;
  }

  renderShadows() {
    let g = new Graphics();
    g.toDraw = this.toDraw.slice(0);
    g.drawShadowsOnly = true;
    g.renderBuffer();
  }

  renderBuffer(holdRenderAfter = false, emptyBuffer = true) {
    const locations = Model.instance.locationCache;
    this.holdRender = false;

    let drawIndex = 0;
    this.toDraw.forEach((e) => {
      let shopInitData = null;
      if (drawIndex in locations) shopInitData = locations[drawIndex];
      if (this.drawShadowsOnly && e.p.drawShadows) {
        e.g.shadow = true;
      } else {
        e.g.shadow = false;
      }
      if (e.m === Graphics.DRAW_CURVY_POLYGON) e.g.drawCurvyPolygon(e.p);
      else if (e.m === Graphics.DRAW_POLYGON) e.g.drawPolygon(e.p);
      else if (
        e.m === Graphics.DRAW_SHOP &&
        this.drawShadowsOnly &&
        e.p.drawShadows
      )
        e.g.drawPolygon(e.p);
      else if (e.m === Graphics.DRAW_SHOP)
        e.g.drawShop(e.p, e.patch, shopInitData);
      drawIndex++;

      if (emptyBuffer) this.toDraw = [];

      this.holdRender = holdRenderAfter;

      District.cleanUp();
      drawIndex++;
    });
  }
}
