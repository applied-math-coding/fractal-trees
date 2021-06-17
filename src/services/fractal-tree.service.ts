import { TreeParams } from '../domain/tree-params';
import { TreeNode } from '../domain/tree-node';
import { Point } from '@/domain/point';

export class FractalTreeService {

  calculate(p: TreeParams): TreeNode {
    const root = new TreeNode(p.startingPoint);
    this.recCalc({
      prev: null,
      cur: root,
      p,
      level: 0
    });
    return root;
  }

  paint(r: TreeNode, ctx: CanvasRenderingContext2D | null, c: HTMLCanvasElement) {
    r.childNodes.forEach(tn => {
      ctx?.moveTo(...this.transToCanvasCoords(r.point, c));
      ctx?.lineTo(...this.transToCanvasCoords(tn.point, c));
      ctx?.stroke();
      this.paint(tn, ctx, c);
    });
  }

  private transToCanvasCoords(p: Point, c: HTMLCanvasElement): [number, number] {
    return [c.width / 2 + p.x, c.height - p.y];
  }

  private recCalc({ prev, cur, p, level }:
    { prev: TreeNode | null, cur: TreeNode, p: TreeParams, level: number }) {
    prev = prev ?? new TreeNode(new Point(0, 0));
    const curDirectionVec = this.addPoints(cur.point, this.multiplyScalar(-1, prev.point));  // curr - prev
    const numberOfSectors = p.numberBranches - 1;
    const totalAngle = numberOfSectors * p.angle;
    const offsetAngle = Math.PI / 2 - 0.5 * (Math.PI - totalAngle);
    const baseDirectionVec = this.multiplyScalar(
      p.branchFactor,
      this.rotate(curDirectionVec, -offsetAngle)
    ); // rotate to based position and adjust length
    for (let idx = 0; idx < p.numberBranches; idx++) {
      const newDirectionVec = this.rotate(baseDirectionVec, idx * p.angle);
      cur.childNodes.push(new TreeNode(
        this.addPoints(cur.point, newDirectionVec)
      ));
    }
    if (level + 1 < p.maxLevels) {
      for (const tn of cur.childNodes) {
        this.recCalc({
          prev: cur,
          cur: tn,
          p,
          level: level + 1
        });
      }
    }
  }

  private rotate(p: Point, angle: number): Point {
    return new Point(
      p.x * Math.cos(angle) - p.y * Math.sin(angle),
      p.x * Math.sin(angle) + p.y * Math.cos(angle)
    );
  }

  private addPoints(p1: Point, p2: Point): Point {
    return new Point(p1.x + p2.x, p1.y + p2.y);
  }

  private multiplyScalar(s: number, p: Point): Point {
    return new Point(s * p.x, s * p.y);
  }
}
