<template>
  <div class="menu-wrapper">
    <div class="img-container" ref="containerRef">
      <!-- The background image -->
      <img
        src="/images/menu.png"
        alt="Menu"
        usemap="#menuMap"
        ref="menuImage"
        @load="onImageLoad"
      />

      <!-- Timer -->
      <div class="timer" :style="timerStyle">
        {{ formatTime(gameState.timeLeft) }}
      </div>
    </div>

    <!-- Image map -->
    <map name="menuMap">
      <area 
        shape="rect"
        coords="1,571,204,775"
        alt="Indices"
        href="#"
        @click.prevent="openIndices"
      />
      <!-- ... more areas ... -->
    </map>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { gameState } from '../store/gameStore.js';
import imageMapResize from 'image-map-resizer';

const menuImage = ref(null);
const containerRef = ref(null);

// Timer style (position + size) dynamically updated
const timerStyle = ref({});

// Replace with your actual original image dimensions
// so that scale calculations are correct.
const ORIGINAL_IMAGE_WIDTH = 709; 
const ORIGINAL_IMAGE_HEIGHT = 1323;

// The timer's original position/size *within* that image.
// For example, from (145, 95) to (560, 278) in your design.
const ORIGINAL_TIMER_LEFT = 145;
const ORIGINAL_TIMER_TOP = 95;
const ORIGINAL_TIMER_WIDTH = 560 - 145;  // 415
const ORIGINAL_TIMER_HEIGHT = 278 - 95;  // 183

function formatTime(seconds) {
  const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
  const ss = (seconds % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}

// Recalculate the timer's position/size based on how the image is actually displayed
function recalcTimerPosition() {
  if (!menuImage.value || !containerRef.value) return;

  // bounding box of the container
  const containerRect = containerRef.value.getBoundingClientRect();
  // bounding box of the actual rendered image
  const imgRect = menuImage.value.getBoundingClientRect();

  // The actual displayed size of the image (no cropping because of object-fit: contain)
  const displayedWidth = imgRect.width;
  const displayedHeight = imgRect.height;

  // The offset of the image relative to the container (i.e., letterbox space)
  const offsetX = imgRect.left - containerRect.left;
  const offsetY = imgRect.top - containerRect.top;

  // Scale factors from original design → actual displayed
  const scaleX = displayedWidth / ORIGINAL_IMAGE_WIDTH;
  const scaleY = displayedHeight / ORIGINAL_IMAGE_HEIGHT;

  // Scaled positions
  const scaledLeft = ORIGINAL_TIMER_LEFT * scaleX;
  const scaledTop = ORIGINAL_TIMER_TOP * scaleY;
  const scaledWidth = ORIGINAL_TIMER_WIDTH * scaleX;
  const scaledHeight = ORIGINAL_TIMER_HEIGHT * scaleY;

  // Combine with offset so timer is pinned to actual image, ignoring letterbox space
  timerStyle.value = {
    position: 'absolute',
    left: `${offsetX + scaledLeft}px`,
    top: `${offsetY + scaledTop}px`,
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
    // styling extras:
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    'border-radius': '8px',
    'z-index': '10',
  };
}

function onImageLoad() {
  // Make the image-map responsive
  imageMapResize();
  // Recalculate position once the image has an actual size
  recalcTimerPosition();
}

onMounted(() => {
  // Recalc when first mounted
  nextTick(() => {
    recalcTimerPosition();
  });

  // Also recalc on window resize
  window.addEventListener('resize', recalcTimerPosition);
});
</script>

<style scoped>
/* Container occupying the full viewport */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.menu-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative; 
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000; /* to visualize letterboxing more clearly */
}

.img-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* The image uses object-fit: contain to avoid cropping */
.img-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* Timer is absolutely positioned. 
   The final position and size come from :style="timerStyle". */
.timer {
  pointer-events: none; /* so it doesn't block clicks on map areas */
  text-align: center;
  font-size: 1.2rem;
}
</style>
