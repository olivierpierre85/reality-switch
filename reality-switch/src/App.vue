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

<script>
import { computed, onMounted } from 'vue';
import { gameState } from './store/gameStore.js';

import MenuPage from './components/MenuPage.vue';
import MachinePage from './components/MachinePage.vue';
import NumericKeypad from './components/NumericKeypad.vue';

export default {
  components: {
    NumericKeypad,
    MenuPage,
    MachinePage,
  },
  setup() {
    /**
     * Decide which component to display based on gameState.currentPage
     */
    const currentPageComponent = computed(() => {
      switch (gameState.currentPage) {
        case 'menu':
          return 'MenuPage';
        case 'machine':
          return 'MachinePage';
        default:
          return 'MenuPage';
      }
    });

    let timerInterval = null;

    // Start the timer if `timerRunning` is true (and not already started)
    function startTimer() {
      if (timerInterval) return;  // Avoid multiple intervals
      timerInterval = setInterval(() => {
        if (gameState.timeLeft > 0) {
          gameState.timeLeft--;
        } else {
          clearInterval(timerInterval);
          timerInterval = null;
          gameState.timerRunning = false;
        }
      }, 1000);
    }

    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    // This toggles the state, and starts/stops the interval
    function toggleTimer() {
      if (gameState.timerRunning) {
        gameState.timerRunning = false;
        stopTimer();
        // Also stop music if you want
        gameState.isMusicPlaying = false;
      } else {
        gameState.timerRunning = true;
        startTimer();
        // Also start music if you want
        gameState.isMusicPlaying = true;
      }
    }

    function applyPenalty() {
      if (gameState.timeLeft > gameState.penalty) {
        gameState.timeLeft -= gameState.penalty;
      } else {
        gameState.timeLeft = 0;
      }
    }

    function closeNumericPad() {
      gameState.showNumericPad = false;
      gameState.numericPadContext = null;
    }

    onMounted(() => {
      // If the timerRunning was restored as true, start it
      if (gameState.timerRunning) {
        startTimer();
      }
    });

    return {
      gameState,
      currentPageComponent,
      toggleTimer,
      applyPenalty,
      closeNumericPad,
    };
  },
};
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
