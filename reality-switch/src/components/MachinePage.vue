<template>
  <div class="machine-wrapper">
    <div class="outer-center">
      <div class="img-container">
        <!-- The base puzzle image -->
        <img src="/images/45.png" alt="Machine" usemap="#machineMap" />
        
        <!-- Overlays for cut wires ("X") -->
        <div
          v-for="wire in gameState.cutWires"
          :key="wire"
          class="wire-cross"
          :class="`wire-${wire}`"
        >
          <!-- You could also use an <img> for the cross, e.g.:
               <img src="/images/cross.png" alt="X" /> -->
          X
        </div>
      </div>
    </div>

    <!-- Image map for interactive areas -->
    <map name="machineMap">
      <area
        shape="rect"
        coords="65,415,185,660"
        alt="wire1"
        href="#"
        @click.prevent="cutWire(1)"
      />
      <area
        shape="rect"
        coords="190,415,302,660"
        alt="wire2"
        href="#"
        @click.prevent="cutWire(2)"
      />
      <area
        shape="rect"
        coords="309,415,415,660"
        alt="wire3"
        href="#"
        @click.prevent="cutWire(3)"
      />
      <area
        shape="rect"
        coords="425,415,527,660"
        alt="wire4"
        href="#"
        @click.prevent="cutWire(4)"
      />
      <area
        shape="rect"
        coords="537,415,645,660"
        alt="wire5"
        href="#"
        @click.prevent="cutWire(5)"
      />
      <area
        shape="rect"
        coords="558,37,674,155"
        alt="Exit"
        href="#"
        @click.prevent="goBackToMenu"
      />
    </map>

    <!-- Result image displayed similarly to MenuPage -->
    <div v-if="resultImage" class="outer-center result-overlay">
      <div class="img-container">
        <!-- Use a map for the result image, 
            so we can define a clickable area to exit -->
        <img
          :src="`/images/${resultImage}`"
          alt="Result"
          usemap="#resultMap"
        />
        <map name="resultMap">
          <!-- Invisible click area (similar to your 'Exit' coords)
              that calls goBackToMenu -->
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { gameState } from '../store/gameStore.js';
import imageMapResize from 'image-map-resizer';

export default {
  setup() {
    // Which wires are correct
    const correctWires = [2, 4];
    const resultImage = ref('');

    function goBackToMenu() {
      gameState.currentPage = 'menu';
    }

    /**
     * Called when a user clicks on a wire area.
     * - If the wire is already cut, do nothing.
     * - Otherwise, mark it as cut.
     * - If it's incorrect, show error image (or go to error card).
     * - If it's correct, check if all correct wires are cut => show success image.
     */
    function cutWire(wireNumber) {
      // If wire is already cut, do nothing
      if (gameState.cutWires.includes(wireNumber)) {
        return;
      }

      // Mark this wire as cut
      gameState.cutWires.push(wireNumber);

      // Check if it's a correct wire
      if (!correctWires.includes(wireNumber)) {
        // Wrong wire => show error image (or navigate)
        resultImage.value = '46.png'; // Example error image
      } else {
        // Correct wire => check if all correct wires are now cut
        const allCorrectCut = correctWires.every(w => gameState.cutWires.includes(w));
        if (allCorrectCut) {
          // Show success image
          resultImage.value = '47.png'; // Example success image
        }
      }
    }

    onMounted(() => {
      // Make the image map responsive
      imageMapResize();
    });

    return {
      gameState,
      resultImage,
      cutWire,
      goBackToMenu
    };
  }
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
  min-height: 100vh;
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

/* 
  Cross overlays:
  We'll position them in percentages so that they track the image scale.
  The percentages below assume the original Machine image is 695px wide x 1095px high.
  If your image differs, adjust these carefully.
*/
.wire-cross {
  position: absolute;
  color: red;
  font-size: 3rem;
  font-weight: bold;
  pointer-events: none; /* let clicks pass through to the image map */
  transform: translate(-50%, -50%); /* so the "X" is centered at the coordinate */
}

/* 
  Wire #1 center:
  Original bounding box: (65,415) to (185,660)
  Approx center is (125,537.5).
  => left: (125/695)*100% ~ 18%, top: (537.5/1095)*100% ~ 49%
*/
.wire-1 {
  left: 18%;
  top: 49%;
}

/* 
  Wire #2 center:
  Box: (190,415) to (302,660)
  => center ~ (246,537.5)
  => left ~ 35%, top ~ 49%
*/
.wire-2 {
  left: 35%;
  top: 49%;
}

/*
  Wire #3 center:
  Box: (309,415) to (415,660)
  => center ~ (362,537.5)
  => left ~ 52%, top ~ 49%
*/
.wire-3 {
  left: 52%;
  top: 49%;
}

/*
  Wire #4 center:
  Box: (425,415) to (527,660)
  => center ~ (476,537.5)
  => left ~ 68%, top ~ 49%
*/
.wire-4 {
  left: 68%;
  top: 49%;
}

/*
  Wire #5 center:
  Box: (537,415) to (645,660)
  => center ~ (591,537.5)
  => left ~ 85%, top ~ 49%
*/
.wire-5 {
  left: 85%;
  top: 49%;
}

/* 
  Result overlay uses the same "outer-center" approach 
  so the image is fully visible and not cropped 
*/
.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7); /* semi-transparent overlay */
  z-index: 9999;
}

.close-button {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
}
</style>
