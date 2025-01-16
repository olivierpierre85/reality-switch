<!-- src/components/MenuPage.vue -->
<template>
    <div>
      <img
        src="/images/menu.png"
        alt="Menu"
        usemap="#menuMap"
        style="max-width: 100%; height: auto;"
      />
  
      <!-- Here is your image map definition -->
      <map name="menuMap">
        <!-- Example “Play/Pause” zone -->
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
  