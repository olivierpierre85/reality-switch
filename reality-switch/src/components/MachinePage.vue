<!-- src/components/MachinePage.vue -->
<template>
    <div>
      <img src="/images/45.png" alt="Machine" usemap="#machineMap" />
  
      <map name="machineMap">
        <!-- Suppose you have 4 wires shaped as circles or rectangles for simplicity -->
        <area shape="circle" coords="100,100,50" alt="wire1" @click="selectWire(1)" />
        <area shape="circle" coords="300,100,50" alt="wire2" @click="selectWire(2)" />
        <area shape="circle" coords="100,300,50" alt="wire3" @click="selectWire(3)" />
        <area shape="circle" coords="300,300,50" alt="wire4" @click="selectWire(4)" />
      </map>
  
      <p>Selected Wires: {{ gameState.selectedWires.join(', ') }}</p>
      <button @click="validateWires">Valider</button>
  
      <!-- If resultImage is not empty, show it -->
      <div v-if="resultImage">
        <img :src="`/images/${resultImage}`" alt="Result" />
        <button @click="closeResult">OK</button>
      </div>
  
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { gameState } from '../store/gameStore.js';
  
  export default {
    setup() {
      const correctWires = [2, 4]; // or whichever wires are correct
      const resultImage = ref('');
  
      function selectWire(wire) {
        if (!gameState.selectedWires.includes(wire)) {
          // If user has not selected this wire yet, add it
          gameState.selectedWires.push(wire);
          // If user has already 2 wires, remove the oldest
          if (gameState.selectedWires.length > 2) {
            gameState.selectedWires.shift(); 
          }
        } else {
          // If wire is already in selected, remove it
          gameState.selectedWires = gameState.selectedWires.filter(w => w !== wire);
        }
      }
  
      function validateWires() {
        // Compare gameState.selectedWires with correctWires
        if (arraysEqual(gameState.selectedWires, correctWires)) {
          resultImage.value = '47.jpg';
          // play "vrai.wav" -> then handle music if needed
        } else {
          resultImage.value = '46.jpg';
          // play "faux.wav"
        }
      }
  
      function arraysEqual(a, b) {
        // Sort them so order doesn’t matter if you want
        // or strictly compare if order matters
        return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
      }
  
      function closeResult() {
        resultImage.value = '';
        // maybe reset selected wires
        gameState.selectedWires = [];
        // go back to menu or do something else
      }
  
      return {
        gameState,
        resultImage,
        selectWire,
        validateWires,
        closeResult,
      };
    },
  };
  </script>
  