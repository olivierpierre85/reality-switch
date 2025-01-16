<template>
    <div class="menu-wrapper">
      <div class="img-container">
        <!-- The image map can still work, but remember the coords must match the scaled size. -->
        <img 
          src="/images/menu.png" 
          usemap="#menuMap" 
          alt="Menu"
        />
      </div>
  
      <!-- Overlays: This could be extra info or absolute-positioned buttons. -->
      <!-- Example “Exit” button in top-right corner: -->
      <button class="exit-button" @click="onExit">Exit</button>
  
      <map name="menuMap">
        <area 
          shape="rect" 
          coords="50,50,150,150"
          alt="PlayPause"
          @click="onPlayPause"
        />
        <!-- Example “Indices” zone -->
        <area
          shape="circle"
          coords="300,100,50"
          alt="Indices"
          @click="onIndices"
        />
        <!-- More zones as needed... -->
      </map>
    </div>
  </template>
  
  <script>
  import { gameState } from '../store/gameStore.js';
  
  export default {
    setup() {
      function onPlayPause() {
        // In a small project, we can directly toggle from here
        // but better to define a function in the store or in App.
        if (gameState.timerRunning) {
          // Pause
          gameState.timerRunning = false;
        } else {
          // Play
          gameState.timerRunning = true;
        }
      }
  
      function onIndices() {
        // Show numeric keypad for "indices"
        gameState.showNumericPad = true;
        gameState.numericPadContext = 'indices';
      }
  
      return {
        onPlayPause,
        onIndices,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Make body & html fill the screen without scrollbars */
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden; /* no scrollbars */
  }
  
  /* Wrapper for the entire menu page */
  .menu-wrapper {
    width: 100vw;
    height: 100vh;
    position: relative; /* So we can absolutely-position overlays within */
    margin: 0;
    padding: 0;
  }
  
  /* Flex container for centering the image */
  .img-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;  /* center horizontally */
    align-items: center;      /* center vertically */
    overflow: hidden;         /* no scrollbars */
  }
  
  /* The image scales while maintaining aspect ratio */
  .img-container img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    /* No forced width or height, so it "contains" the image within the screen */
  }
  
  /* Example of a button over the image in the top-right corner */
  .exit-button {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 999;   /* ensure above the image */
    /* your styling here */
  }
  </style>
  