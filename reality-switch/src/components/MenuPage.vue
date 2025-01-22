<template>
  <div class="menu-wrapper">
    <div class="outer-center">
      <div class="img-container">
        <img
          src="/images/menu.png"
          alt="Menu"
          usemap="#menuMap"
        />
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
        alt="Play"
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
      <!-- Machine TODO: now navigating to the machine page -->
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
import { onMounted, ref } from 'vue';
import { gameState } from '../store/gameStore.js';
import imageMapResize from 'image-map-resizer';

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
  // Optional: stop or resume music
}

/**
 * Reset timer
 */
function onResetTimer() {
  // Example: reset to 3600 seconds
  gameState.timeLeft = 3600;
  gameState.cutWires = []; //Also reset machine
}

/**
 * Play/pause timer
 */
function onPlayPause() {
  if (gameState.timerRunning) {
    stopTimer();
  } else {
    startTimer();
  }
}

/**
 * Apply penalty to the timer
 */
function onPenalty() {
  if (gameState.timeLeft > gameState.penalty) {
    gameState.timeLeft -= gameState.penalty;
  } else {
    gameState.timeLeft = 0;
  }
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
 * Timer logic
 */
let timerInterval = null;

function startTimer() {
  if (timerInterval) return; // Avoid duplicates
  gameState.timerRunning = true;
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
  gameState.timerRunning = false;
}

onMounted(() => {
  imageMapResize();
  // If the timer was active, make sure we start it
  if (gameState.timerRunning && !timerInterval) {
    startTimer();
  }
});
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
