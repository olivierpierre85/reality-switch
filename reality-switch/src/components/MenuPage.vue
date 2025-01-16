<template>
  <div class="menu-wrapper">
    <!-- If you still want to center the entire image+timer on the page: -->
    <div class="outer-center">
      <div class="img-container">
        <img
          src="/images/menu.png"
          alt="Menu"
          usemap="#menuMap"
        />
        <div class="timer">
          {{ formatTime(gameState.timeLeft) }}
        </div>
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
.menu-wrapper {
  /* Remove height: 100vh if it forces leftover space */
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* or auto */
  overflow-y: auto;
}

/* Optional: center it all on the page */
.outer-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Key point: shrink-wrap the image */
.img-container {
  position: relative;
  display: inline-block; /* or block, but let it size to the image */
}

/* Let the image define its own width/height */
.img-container img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%; /* if you want it to be responsive but not forced to 100% height */
  max-height: 100vh;
}

/* Timer absolutely positioned relative to .img-container */
.timer {
  position: absolute;
  /* Example: top and left in px based on original design, 
     or in % if you know the image’s aspect ratio. */
  left: 21%;
  top: 7.5%;
  width: 58%;
  height: 13%;
  /* styling... */
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
