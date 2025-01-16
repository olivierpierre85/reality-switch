<template>
  <div class="app-container">

    <!-- Timer and top bar actions could go here -->
    <header>
      <div class="timer">
        <span>{{ formatTime(gameState.timeLeft) }}</span>
      </div>

      <!-- Play/Pause button -->
      <button @click="toggleTimer">
        {{ gameState.timerRunning ? 'Pause' : 'Play' }}
      </button>

      <!-- Penalty button -->
      <button @click="applyPenalty">
        -1 min
      </button>
    </header>

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
import { computed } from 'vue';
import { gameState } from './store/gameStore.js';

// Import your components
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

    /**
     * Timer logic
     */
    let timerInterval = null;

    function toggleTimer() {
      if (gameState.timerRunning) {
        // Pause
        clearInterval(timerInterval);
        gameState.timerRunning = false;
        // Pause the music if you want
        gameState.isMusicPlaying = false;
      } else {
        // Play
        gameState.timerRunning = true;
        // Start interval
        timerInterval = setInterval(() => {
          if (gameState.timeLeft > 0) {
            gameState.timeLeft--;
          } else {
            // Timer finished
            clearInterval(timerInterval);
            gameState.timerRunning = false;
            // Possibly stop music or do something else
          }
        }, 1000);
        // Start music
        gameState.isMusicPlaying = true;
      }
    }

    function applyPenalty() {
      if (gameState.timeLeft > gameState.penalty) {
        gameState.timeLeft -= gameState.penalty;
      } else {
        gameState.timeLeft = 0; // if smaller than penalty
      }
    }

    function formatTime(seconds) {
      const mm = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
      const ss = (seconds % 60).toString().padStart(2, '0');
      return `${mm}:${ss}`;
    }

    function closeNumericPad() {
      gameState.showNumericPad = false;
      gameState.numericPadContext = null;
    }

    return {
      gameState,
      currentPageComponent,
      toggleTimer,
      applyPenalty,
      formatTime,
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
header {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
