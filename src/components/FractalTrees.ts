import { Point } from "@/domain/point";
import { TreeNode } from "@/domain/tree-node";
import { TreeParams } from "@/domain/tree-params";
import { defineComponent } from "vue";
import { fractalTreeService } from "../services/index";

export default defineComponent({
  name: "FractalTrees",
  data() {
    return {
      tree: new TreeNode(new Point(0, 0), -1),
      treeParams: new TreeParams(),
      calculating: false,
      interrupted: false,
      progress: 0,
      calculated: false,
      showActions: true,
      isSmallScreen: true
    };
  },
  created() {
    this.initMediaListener();
  },
  computed: {
    numberNodes(): string {
      return new Intl.NumberFormat().format(this.computeNumberNodes());
    },
    angleInDegree: {
      get(): number {
        return Math.round((this.treeParams.angle * 180) / Math.PI);
      },
      set(v: number) {
        this.treeParams.angle = (v * Math.PI) / 180;
      },
    },
  },
  methods: {
    initMediaListener(): void {
      const mediaQuery = '(min-width: 1000px)';
      const mediaQueryList = window.matchMedia(mediaQuery);
      this.isSmallScreen = !mediaQueryList.matches;
      mediaQueryList.addEventListener('change', e => {
        this.isSmallScreen = !e.matches;
        e.matches && (this.showActions = true);
      });
    },
    handleToggleActions(): void {
      this.showActions = !this.showActions;
    },
    computeNumberNodes(): number {
      return (
        (1 - this.treeParams.numberBranches ** this.treeParams.maxLevels) /
        (1 - this.treeParams.numberBranches)
      );
    },
    handleStop() {
      this.interrupted = true;
    },
    handleExport() {
      const url = (this.$refs.canvas as HTMLCanvasElement).toDataURL();
      const a = document.createElement("a");
      a.setAttribute("href", url);
      document.body.appendChild(a);
      a.download = "fractal-tree"; // this flags <a> to be a download link
      a.click();
      document.body.removeChild(a);
    },
    async handleCalculate() {
      this.calculating = true;
      this.interrupted = false;
      const c = this.$refs.canvas as HTMLCanvasElement;
      const ctx = c.getContext("2d");
      clearCanvas(c);
      let lastPaintStopTime = new Date().getTime();
      const g = fractalTreeService.calculate(this.treeParams);
      let res: { value: TreeNode; done?: boolean };
      this.progress = 0;
      let nodeCounter = 0;
      let numberNodes = this.computeNumberNodes();
      await wait(); // keep air for conditional rendering
      while (!(res = g.next()).done) {
        fractalTreeService.paint(res.value, ctx, c, this.treeParams);
        const time = new Date().getTime();
        if (time - lastPaintStopTime > 500) {
          await wait(); // keep air for stop-button
          lastPaintStopTime = time;
        }
        if (this.interrupted) {
          break;
        }
        nodeCounter++;
        this.progress = Math.floor((100 * nodeCounter) / numberNodes);
      }
      ctx?.stroke();
      this.calculating = false;
      this.calculated = true;
      if (this.isSmallScreen) {
        this.showActions = false;
      }
    },
  },
});

function wait(): Promise<void> {
  return new Promise<void>((r) => setTimeout(() => r()));
}

function clearCanvas(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d");
  ctx?.clearRect(0, 0, c.width, c.height);
  ctx?.beginPath();
}