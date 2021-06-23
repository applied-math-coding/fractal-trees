import { Point } from './point';

export class TreeNode {
  point: Point;
  childNodes: TreeNode[] = [];
  level: number;

  constructor(point: Point, level: number, childNodes?: TreeNode[]) {
    this.point = point;
    this.level = level;
    this.childNodes = childNodes || [];
  }
}