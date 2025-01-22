// src/store/gameStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGameStore = defineStore('game', () => {
  // Reactive state
  const timeLeft = ref(3600); // Initialize to 3600 seconds (1 hour)
  const timerRunning = ref(false);
  const cutWires = ref([]);
  const isMuted = ref(false);
  const currentPage = ref('menu');
  const showNumericPad = ref(false);
  const numericPadContext = ref('');
  const penalty = ref(60); // Example penalty value
  const lastEnteredCardNumber = ref(null);
  const currentIndiceIndex = ref({});
  const currentObjetIndex = ref({}); 

  // Internal timer reference
  let timerInterval = null;

  // Actions
  function startTimer() {
    if (timerRunning.value) return; // Prevent multiple timers
    timerRunning.value = true;
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        stopTimer();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timerRunning.value = false;
  }

  function resetTimer() {
    timeLeft.value = 3600; // Reset to 1 hour
    cutWires.value = []; // Reset machine
    stopTimer();
  }

  function applyPenalty() {
    if (timeLeft.value > penalty.value) {
      timeLeft.value -= penalty.value;
    } else {
      timeLeft.value = 0;
    }
  }

  return {
    // State
    timeLeft,
    timerRunning,
    cutWires,
    isMuted,
    currentPage,
    showNumericPad,
    numericPadContext,
    penalty,
    lastEnteredCardNumber,
    currentIndiceIndex,
    currentObjetIndex,

    // Actions
    startTimer,
    stopTimer,
    resetTimer,
    applyPenalty,
  };
});
