<template>
  <div class="machine-wrapper">
    <!-- Outer-center wraps everything to center the content both horizontally and vertically -->
    <div class="outer-center">
      <!-- img-container is the same approach you have in MenuPage -->
      <div class="img-container">
        <img src="/images/45.png" alt="Machine" usemap="#machineMap" />
        <map name="machineMap">
          <!-- Areas for wires -->
          <!-- <area
            shape="circle"
            coords="100,100,50"
            alt="wire1"
            @click="selectWire(1)"
          />
          <area
            shape="circle"
            coords="300,100,50"
            alt="wire2"
            @click="selectWire(2)"
          />
          <area
            shape="circle"
            coords="100,300,50"
            alt="wire3"
            @click="selectWire(3)"
          />
          <area
            shape="circle"
            coords="300,300,50"
            alt="wire4"
            @click="selectWire(4)"
          />
          <area
            shape="circle"
            coords="300,300,50"
            alt="wire4"
            @click="selectWire(5)"
          /> -->
          <area
            shape="rect"
            coords="558,37,674,155"
            alt="Exit"
            href="#"
            @click.prevent="goBackToMenu"
          />
        </map>
      </div>
    </div>

    <!-- Now place the text/buttons below (or above) as you prefer -->
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
import { ref, onMounted } from 'vue';
import { gameState } from '../store/gameStore.js';
import imageMapResize from 'image-map-resizer';

export default {
  setup() {
    const correctWires = [2, 4];
    const resultImage = ref('');

    function goBackToMenu() {
      gameState.currentPage = 'menu';
    }

    function selectWire(wire) {
      if (!gameState.selectedWires.includes(wire)) {
        gameState.selectedWires.push(wire);
        if (gameState.selectedWires.length > 2) {
          gameState.selectedWires.shift();
        }
      } else {
        gameState.selectedWires = gameState.selectedWires.filter((w) => w !== wire);
      }
    }

    function validateWires() {
      if (arraysEqual(gameState.selectedWires, correctWires)) {
        resultImage.value = '47.jpg';
        // play "vrai.wav" if needed
      } else {
        resultImage.value = '46.jpg';
        // play "faux.wav" if needed
      }
    }

    function arraysEqual(a, b) {
      return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
    }

    function closeResult() {
      resultImage.value = '';
      gameState.selectedWires = [];
      // Possibly go back to menu or stay on this page
      // gameState.currentPage = 'menu';
    }

    // Watch for component unmount to clean up if necessary
    onMounted(() => {
      imageMapResize();
    });

    return {
      gameState,
      resultImage,
      selectWire,
      goBackToMenu,
      validateWires,
      closeResult,
    };
  },
};
</script>

<style scoped>
.machine-wrapper {
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
  min-height: 100vh; /* So it occupies full viewport height */
}

.img-container {
  position: relative;
  display: inline-block;
}

.img-container img {
  display: block;
  width: auto;        /* Use auto width so image scales proportionally */
  height: auto;       /* Use auto height so image scales proportionally */
  max-width: 100%;    /* Don’t exceed the container width */
  max-height: 100vh;  /* Don’t exceed the viewport height */
}
</style>
