import Point from "./Point";
export default class WB_Segment {
  start; //: Point;
  end; //: Point;

  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  get dx() {
    return end.x - start.x;
  }

  get dy() {
    return end.y - start.y;
  }

  get vector() {
    return end.subtract(start);
  }

  get length() {
    return Point.distance(start, end);
  }
}
