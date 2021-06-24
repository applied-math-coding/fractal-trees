import { Point } from './point';

export class TreeParams {
  startingPoint = new Point(0, 100);
  angle = 30.0 / 360.0 * 2 * Math.PI;
  numberBranches = 2;
  branchFactor = 0.75;
  maxLevels = 10;
  colorize = false;
  showLimitsOnly = false;
}