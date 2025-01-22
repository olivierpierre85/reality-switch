<template>
  <div class="menu-wrapper">
    <div class="outer-center">
      <div class="img-container">
        <img src="/images/menu.png" alt="Menu" usemap="#menuMap" />
        <!-- Show Timer only if we are in 'menu' page -->
        <div class="timer">
          {{ formatTime(gameState.timeLeft) }}
        </div>
      </div>
    </div>

    <map name="menuMap">
      <!-- Mute/Unmute -->
      <area
        shape="rect"
        coords="22,26,229,70"
        alt="Mute/Unmute"
        href="#"
        @click.prevent="onMuteUnmute"
      />
      <!-- Reset Timer -->
      <area
        shape="rect"
        coords="487,26,694,70"
        alt="Reset Timer"
        href="#"
        @click.prevent="onResetTimer"
      />
      <area
        shape="rect"
        coords="1,571,204,775"
        alt="Indices"
        href="#"
        @click.prevent="openIndices"
      />
      <area
        shape="rect"
        coords="230,358,471,577"
        alt="Play/Pause"
        href="#"
        @click.prevent="onPlayPause"
      />
      <area
        shape="rect"
        coords="230,642,471,858"
        alt="Penalty"
        href="#"
        @click.prevent="onPenalty"
      />
      <area
        shape="rect"
        coords="510,570,695,785"
        alt="Codes"
        href="#"
        @click.prevent="openCodes"
      />
      <area
        shape="rect"
        coords="40,875,280,1095"
        alt="Objects"
        href="#"
        @click.prevent="openObjects"
      />
      <!-- Machine: now navigating to the machine page -->
      <area
        shape="rect"
        coords="438,875,678,1095"
        alt="Machine"
        href="#"
        @click.prevent="openMachine"
      />
    </map>
  </div>
</template>

<script setup>
import { onMounted, watch, nextTick } from 'vue';
import { useGameStore } from '../store/gameStore.js';
import imageMapResize from 'image-map-resizer';

// Initialize the store
const gameState = useGameStore();

/**
 * Format time as mm:ss
 */
const formatTime = (seconds) => {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const ss = (seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mm}:${ss}`;
};

/**
 * Mute/unmute logic
 */
function onMuteUnmute() {
  gameState.isMuted = !gameState.isMuted;
  // Optional: stop or resume music based on isMuted
}

/**
 * Reset timer
 */
function onResetTimer() {
  gameState.resetTimer();
}

/**
 * Play/Pause timer
 */
function onPlayPause() {
  if (gameState.timerRunning) {
    gameState.stopTimer();
  } else {
    gameState.startTimer();
  }
}

/**
 * Apply penalty to the timer
 */
function onPenalty() {
  gameState.applyPenalty();
}

/**
 * Numeric pad for Indices, Objects, or Codes
 */
function openIndices() {
  gameState.showNumericPad = true;
  gameState.numericPadContext = 'indices';
}

function openObjects() {
  gameState.showNumericPad = true;
  gameState.numericPadContext = 'objets'; 
}

function openCodes() {
  gameState.showNumericPad = true;
  gameState.numericPadContext = 'codes';
}

/**
 * Navigate to the Machine page (wire-cutting puzzle)
 */
function openMachine() {
  gameState.currentPage = 'machine';
}

/**
 * Initialize the image map and start the timer if it's running
 */
onMounted(() => {
  imageMapResize();
  if (gameState.timerRunning) {
    gameState.startTimer();
  }
});

/**
 * Watch for changes in gameState.timerRunning to start/stop the timer accordingly
 */
watch(
  () => gameState.timerRunning,
  (newVal) => {
    if (newVal) {
      gameState.startTimer();
    } else {
      gameState.stopTimer();
    }
  }
);
</script>

<style scoped>
.menu-wrapper {
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
.outer-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-container {
  position: relative;
  display: inline-block;
}
.img-container img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100vh;
}
.timer {
  position: absolute;
  left: 21%;
  top: 7.5%;
  width: 58%;
  height: 13%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: rgba(0, 0, 0, 1);
  border-radius: 8px;
  z-index: 10;
  font-size: xxx-large;
}
</style>
