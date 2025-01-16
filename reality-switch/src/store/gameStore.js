// src/store/gameStore.js
import { reactive } from 'vue';

export const gameState = reactive({
  currentPage: 'menu',      // "menu", "machine", or any other page
  showNumericPad: false,    // show/hide numeric keypad
  numericPadContext: null,  // "indices", "objets", "codes", etc.
  timerRunning: false,
  timeLeft: 60 * 60,        // 60 minutes (in seconds), example
  penalty: 60,              // 1 minute penalty in seconds

  // Music state
  currentMusic: null,       // "musique1", "musique2", ...
  isMusicPlaying: false,

  // For “machine” wires
  selectedWires: [],

  // For storing card data (optional)
  lastEnteredCardNumber: null,
});