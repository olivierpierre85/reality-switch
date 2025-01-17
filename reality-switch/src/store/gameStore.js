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
});

// Persist to localStorage on page unload/reload
window.addEventListener('beforeunload', () => {
  localStorage.setItem('timeLeft', gameState.timeLeft);
  localStorage.setItem('timerRunning', gameState.timerRunning);
});

// On page load, restore
const savedTime = localStorage.getItem('timeLeft');
const savedRunning = localStorage.getItem('timerRunning');
if (savedTime !== null) {
  gameState.timeLeft = parseInt(savedTime, 10);
}
if (savedRunning !== null) {
  gameState.timerRunning = (savedRunning === 'true');
}