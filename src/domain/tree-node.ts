import { Point } from './point';

export class TreeNode {
  point: Point;
  childNodes: TreeNode[] = [];

  constructor(point: Point) {
    this.point = point;
  }
}