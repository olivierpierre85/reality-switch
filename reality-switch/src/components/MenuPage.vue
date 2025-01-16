<template>
    <div class="menu-wrapper">
      <!-- The image container -->
      <div class="img-container">
        <img
          src="/images/menu.png"
          alt="Menu"
          usemap="#menuMap"
        />
      </div>
  
      <!-- Over-the-image controls -->
      <div class="controls">
        <div class="timer">
          {{ formatTime(gameState.timeLeft) }}
        </div>
  
        <button @click="onPlayPause">
          {{ gameState.timerRunning ? 'Pause' : 'Play' }}
        </button>
  
        <button @click="onPenalty">-1 min</button>
      </div>
  
      <!-- If you still want clickable areas in the image map -->
      <map name="menuMap">
        <!-- Example area for “Indices” -->
        <area
          shape="rect"
          coords="50,50,150,150"
          alt="Indices"
          @click="openIndices"
        />
        <!-- Add more areas as needed -->
      </map>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { gameState } from '../store/gameStore.js';
  
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
    // Show numeric keypad or do whatever you need
    gameState.showNumericPad = true;
    gameState.numericPadContext = 'indices';
  }
  
  /**
   * Example: You might keep these in your store, but
   * here’s a minimal inline approach:
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
  </script>
  
  <style scoped>
  /* Make sure the page itself has no scrollbars */
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
    position: relative; /* so we can absolutely position .controls */
  }
  
  /* Center the image, no scroll, maintain aspect ratio */
  .img-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  .img-container img {
    max-width: 100%;
    max-height: 100%;
    display: block;
  }
  
  /* Controls bar over the image */
  .controls {
    position: absolute;
    top: 3rem; 
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1rem;
    align-items: center;
    z-index: 999; /* on top of the image */
    /* A bit of styling */
    background: rgba(0, 0, 0, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 8px;
  }
  
  .timer {
    color: #fff;
    font-size: 1.2rem;
    min-width: 4ch; /* enough space for "MM:SS" */
  }
  </style>
  