<template>
  <div class="menu-wrapper">
    <!-- The image container -->
    <div class="img-container">
      <img
        src="/images/menu.png"
        alt="Menu"
        usemap="#menuMap"
      />
      
      <!-- Timer positioned over the image -->
      <div class="timer">
        {{ formatTime(gameState.timeLeft) }}
      </div>
    </div>

    <!-- If you still want clickable areas in the image map -->
    <map name="menuMap">
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
        alt="Code TODO"
        href="#"
        @click.prevent="onPenalty"
      />

      <area 
        shape="rect"
        coords="40,875,280,1095"
        alt="Object TODO"
        href="#"
        @click.prevent="onPenalty"
      />

      <area 
        shape="rect"
        coords="438,875,678,1095"
        alt="Machine TODO"
        href="#"
        @click.prevent="onPenalty"
      />
    </map>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { gameState } from '../store/gameStore.js';
import imageMapResize from 'image-map-resizer'; // Import the library

/**
 * Format time from seconds to "mm:ss"
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

function onPlayPause() {
  if (gameState.timerRunning) {
    // Pause
    stopTimer();
  } else {
    // Start
    startTimer();
  }
}

function onPenalty() {
  if (gameState.timeLeft > gameState.penalty) {
    gameState.timeLeft -= gameState.penalty;
  } else {
    gameState.timeLeft = 0;
  }
}

function openIndices() {
  // Show numeric keypad or perform desired action
  gameState.showNumericPad = true;
  gameState.numericPadContext = 'indices';
}

/**
 * Timer functionality
 */
let timerInterval = null;

function startTimer() {
  gameState.timerRunning = true;
  timerInterval = setInterval(() => {
    if (gameState.timeLeft > 0) {
      gameState.timeLeft--;
    } else {
      clearInterval(timerInterval);
      gameState.timerRunning = false;
    }
  }, 1000);

  // Start music, if any
  // ...
}

function stopTimer() {
  clearInterval(timerInterval);
  gameState.timerRunning = false;

  // Pause music, if any
  // ...
}

onMounted(() => {
  // Initialize the image map resizer
  imageMapResize();
});
</script>

<style scoped>
/* Ensure the page itself has no scrollbars */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Wrapper that takes full screen */
.menu-wrapper {
  width: 100vw;
  height: 100vh;
  position: relative; /* To absolutely position .timer */
}

/* Center the image, no scroll, maintain aspect ratio */
.img-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative; /* To contain the absolute .timer */
}

.img-container img {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

/* Timer positioned over the image */
.timer {
  position: absolute;
  left: 20.43%;   /* 145 / 709 */
  top: 7.18%;     /* 95 / 1323 */
  width: 58.53%;  /* (560 - 145) / 709 */
  height: 13.84%; /* (278 - 95) / 1323 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 1.2rem;
  background: rgba(0, 0, 0, 0.5); /* Optional: semi-transparent background */
  border-radius: 8px; /* Optional: rounded corners */
  z-index: 10; /* Ensure it's above the image */
  text-align: center;
}
</style>
