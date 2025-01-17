// store/gameStore.js
import { reactive } from 'vue';

export const gameState = reactive({
  currentPage: 'menu',
  showNumericPad: false,
  numericPadContext: null,

  // Store the last card number entered
  lastEnteredCardNumber: null,

  // Time in seconds. For example, 3600 => 60 minutes
  timeLeft: 3600,
  timerRunning: false,
  penalty: 60,  // e.g. 60 seconds penalty

  // For sound/music
  isMuted: false,
  isMusicPlaying: false,

  // Track current indice index per card number
  currentIndiceIndex: {}, // e.g., { 7: 1, 8: 2, ... }

  // **New:** Track current objet index per card number
  currentObjetIndex: {}, // e.g., { 5: 1, 27: 2, ... }
});

// Persist to localStorage on page unload/reload
window.addEventListener('beforeunload', () => {
  localStorage.setItem('timeLeft', gameState.timeLeft);
  localStorage.setItem('timerRunning', gameState.timerRunning);
  localStorage.setItem('currentIndiceIndex', JSON.stringify(gameState.currentIndiceIndex));
  
  // **New:** Persist currentObjetIndex
  localStorage.setItem('currentObjetIndex', JSON.stringify(gameState.currentObjetIndex));
});

// On page load, restore
const savedTime = localStorage.getItem('timeLeft');
const savedRunning = localStorage.getItem('timerRunning');
const savedIndiceIndex = localStorage.getItem('currentIndiceIndex');
const savedObjetIndex = localStorage.getItem('currentObjetIndex'); // **New**

if (savedTime !== null) {
  gameState.timeLeft = parseInt(savedTime, 10);
}
// Quickfix, because if it restarts, it restars at the rate of 2 secs per sec.
// Todo find why ?
// if (savedRunning !== null) {
//   gameState.timerRunning = (savedRunning === 'true');
// }
if (savedIndiceIndex !== null) {
  gameState.currentIndiceIndex = JSON.parse(savedIndiceIndex);
}
if (savedObjetIndex !== null) { // **New**
  gameState.currentObjetIndex = JSON.parse(savedObjetIndex);
}
