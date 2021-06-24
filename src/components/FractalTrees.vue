<template>
  <div class="content-container">
    <div class="canvas-container">
      <canvas ref="canvas" width="800" height="500"></canvas>
    </div>
    <div class="actions">
      <div class="main-title">Fractal Tree</div>
      <div class="options">
        <div class="option">
          <div class="option-label">Branches:</div>
          <InputNumber
            v-model="treeParams.numberBranches"
            showButtons
            :min="2"
            :max="5"
            :disabled="calculating"
          />
        </div>
        <div class="option">
          <div class="option-label">Levels:</div>
          <InputNumber
            v-model="treeParams.maxLevels"
            showButtons
            :min="2"
            :max="20"
            :disabled="calculating"
          />
        </div>
        <div class="option">
          <div class="option-label">Shrinking factor:</div>
          <div>{{ treeParams.branchFactor }}</div>
          <Slider
            v-model="treeParams.branchFactor"
            :step="0.05"
            :min="0.1"
            :max="1.0"
            :disabled="calculating"
          />
        </div>
        <div class="option">
          <div class="option-label">Angle:</div>
          <InputNumber
            v-model="angleInDegree"
            showButtons
            :min="1"
            :max="180"
            :disabled="calculating"
          />
        </div>
        <div class="option">
          <div class="option-label">Colorize:</div>
          <Checkbox
            v-model="treeParams.colorize"
            :binary="true"
            :disabled="calculating"
          />
        </div>
        <div class="option">
          <div class="option-label">Show limits only:</div>
          <Checkbox
            v-model="treeParams.showLimitsOnly"
            :binary="true"
            :disabled="calculating"
          />
        </div>
      </div>
      <div class="calc-button">
        <Button
          class="p-mr-2"
          label="Calculate!"
          :loading="calculating"
          @click="handleCalculate()"
        />
        <Button
          class="p-button-danger"
          label="Stop"
          v-if="calculating"
          @click="handleStop()"
        />
      </div>
      <div class="number-nodes-positioner">
        <span class="number-nodes">{{ numberNodes }}</span>
        <span class="number-nodes-label"> nodes</span>
      </div>
      <div>
        <ProgressBar class="p-mt-2" v-if="calculating" :value="progress" />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
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
    };
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
    computeNumberNodes(): number {
      return (
        (1 - this.treeParams.numberBranches ** this.treeParams.maxLevels) /
        (1 - this.treeParams.numberBranches)
      );
    },
    handleStop() {
      this.interrupted = true;
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
</script>


<style scoped>
.content-container {
  display: grid;
  grid-template-columns: 100%;
}

.actions {
  height: 50px;
  padding: 5px;
  grid-row: 1;
}

.option {
  margin: 25px 0;
}

.option-label {
  font-size: var(--small-font);
  color: var(--secondary-text-color);
  margin-bottom: 5px;
}

.canvas-container {
  grid-row: 2;
  text-align: center;
}

canvas {
  max-width: 100%;
}

@media (min-width: 1000px) {
  .content-container {
    grid-template-columns: auto 300px;
  }

  .actions {
    min-height: 100vh;
    height: auto;
    grid-row: 1;
    padding: 20px 30px;
    border-left: 1px solid #cccccc;
  }

  .main-title {
    font-size: var(--large-font);
  }

  .calc-button {
    margin-top: 50px;
  }

  .canvas-container {
    grid-row: 1;
  }

  .number-nodes-positioner {
    margin-top: 10px;
  }

  .number-nodes {
    font-size: var(--medium-font);
  }

  .number-nodes-label {
    font-size: var(--small-font);
    color: var(--secondary-text-color);
  }
}
</style>