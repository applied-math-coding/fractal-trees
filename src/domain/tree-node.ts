import { Point } from './point';

export class TreeNode {
  point: Point;
  childNodes: TreeNode[] = [];

  constructor(point: Point, childNodes?: TreeNode[]) {
    this.point = point;
    this.childNodes = childNodes || [];
  }
}