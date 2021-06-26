<template>
  <div class="content-container">
    <div class="canvas-container">
      <canvas ref="canvas" width="800" height="500"></canvas>
    </div>
    <div class="actions-wrapper" :class="{ 'action-shown': showActions }">
      <div class="action-header">
        <Button
          label="Export"
          v-if="!calculating && calculated && !showActions && isSmallScreen"
          @click="handleExport()"
        />
        <div class="action-toggle">
          <i class="pi pi-bars" @click="handleToggleActions()"></i>
        </div>
      </div>
      <div class="actions" v-if="showActions">
        <div class="closing-link">
          <i class="pi pi-times-circle" @click="handleToggleActions()"></i>
        </div>
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
            class="p-mr-2 p-button-success"
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
          <Button
            label="Export"
            v-if="!calculating && calculated"
            @click="handleExport()"
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
  </div>
</template>


<script lang="ts" src="./FractalTrees.ts"></script>
<style lang="scss" scoped src="./FractalTrees.scss"></style>