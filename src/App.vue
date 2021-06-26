<template>
  <FractalTrees></FractalTrees>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FractalTrees from "./components/FractalTrees.vue";

export default defineComponent({
  name: "App",
  components: {
    FractalTrees,
  },
});
</script>

<style>
:root {
  --primary-text-color: #2c3e50;
  --secondary-text-color: #9e9e9e;
  --secondary-bg-color: #f9f9f9;
  --small-font: 0.8rem;
  --medium-font: 1.5rem;
  --large-font: 2rem;
}

* {
  box-sizing: border-box;
}

body {
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: var(--primary-text-color);
}
</style>
