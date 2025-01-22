<!-- src/App.vue -->
<template>
  <div class="app-container">
    <!-- Page content -->
    <component :is="currentPageComponent" />

    <!-- Numeric Keypad as a modal -->
    <NumericKeypad
      v-if="gameState.showNumericPad"
      :context="gameState.numericPadContext"
      @close="closeNumericPad"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from './store/gameStore.js';

import MenuPage from './components/MenuPage.vue';
import MachinePage from './components/MachinePage.vue';
import NumericKeypad from './components/NumericKeypad.vue';

// Initialize the Pinia store
const gameState = useGameStore();

/**
 * Decide which component to display based on gameState.currentPage
 */
const currentPageComponent = computed(() => {
  switch (gameState.currentPage) {
    case 'menu':
      return MenuPage;
    case 'machine':
      return MachinePage;
    default:
      return MenuPage;
  }
});

/**
 * Handle closing the Numeric Keypad modal
 */
function closeNumericPad() {
  gameState.showNumericPad = false;
  gameState.numericPadContext = '';
}
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
