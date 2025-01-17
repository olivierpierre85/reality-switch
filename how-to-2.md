Below is an example refactoring that addresses your requests.  
I’ll outline the main changes:  

1. **NumericKeypad** no longer just shows a simple `<img>` for the result.  
   - Instead, it has a container that displays the result image in the same style as the menu page (with a similar `.img-container` class, a clickable image map, etc.).  
   - It includes a hidden (or separate) `<area>` for the exit button so you can click it like on the menu.  

2. **Hiding the Timer** in the result image view, but keeping it running.  
   - We’ll just not display the timer if `step === 3`. The timer logic in `gameStore` continues to run.  

3. **Adding Mute/Unmute** and **Reset Timer** areas in the menu page.  

4. **Preventing Timer Reset on Page Refresh** (the simplest approach is storing `timeLeft` and whether the timer is running in `localStorage` or `sessionStorage` and restoring them on mounted). Below is an example for `gameStore.js` that persists `timeLeft` and `timerRunning`.  

---

### **store/gameStore.js** (Example)

```js
import { reactive } from 'vue';

export const gameState = reactive({
  currentPage: 'menu',
  showNumericPad: false,
  numericPadContext: null,

  // Store the last card number entered
  lastEnteredCardNumber: null,

  // Time in seconds. For example, 3600 => 60 minutes
  timeLeft: 3600,
  timerRunning: false,
  penalty: 60,  // e.g. 60 seconds penalty

  // For sound/music
  isMuted: false,
  isMusicPlaying: false,
});

// Persist to localStorage on page unload/reload
window.addEventListener('beforeunload', () => {
  localStorage.setItem('timeLeft', gameState.timeLeft);
  localStorage.setItem('timerRunning', gameState.timerRunning);
});

// On page load, restore
const savedTime = localStorage.getItem('timeLeft');
const savedRunning = localStorage.getItem('timerRunning');
if (savedTime !== null) {
  gameState.timeLeft = parseInt(savedTime, 10);
}
if (savedRunning !== null) {
  gameState.timerRunning = (savedRunning === 'true');
}
```

> **Note**: If you want the timer to be *exactly continuous* between page refreshes, you’d need to store a timestamp when the timer started and compute the difference on reload. But the above is a simple approach that *doesn’t fully lose the countdown*.  

---

### **App.vue**  

We keep most of your logic, but ensure the timer is only started once if `timerRunning` is true. We can do this in `onMounted`.

```html
<template>
  <div class="app-container">
    <!-- Page content -->
    <component :is="currentPageComponent" />

    <!-- Numeric Keypad as a modal -->
    <NumericKeypad
      v-if="gameState.showNumericPad"
      :context="gameState.numericPadContext"
      @close="closeNumericPad"
    />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { gameState } from './store/gameStore.js';

import MenuPage from './components/MenuPage.vue';
import MachinePage from './components/MachinePage.vue';
import NumericKeypad from './components/NumericKeypad.vue';

export default {
  components: {
    NumericKeypad,
    MenuPage,
    MachinePage,
  },
  setup() {
    /**
     * Decide which component to display based on gameState.currentPage
     */
    const currentPageComponent = computed(() => {
      switch (gameState.currentPage) {
        case 'menu':
          return 'MenuPage';
        case 'machine':
          return 'MachinePage';
        default:
          return 'MenuPage';
      }
    });

    let timerInterval = null;

    // Start the timer if `timerRunning` is true (and not already started)
    function startTimer() {
      if (timerInterval) return;  // Avoid multiple intervals
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
    }

    // This toggles the state, and starts/stops the interval
    function toggleTimer() {
      if (gameState.timerRunning) {
        gameState.timerRunning = false;
        stopTimer();
        // Also stop music if you want
        gameState.isMusicPlaying = false;
      } else {
        gameState.timerRunning = true;
        startTimer();
        // Also start music if you want
        gameState.isMusicPlaying = true;
      }
    }

    function applyPenalty() {
      if (gameState.timeLeft > gameState.penalty) {
        gameState.timeLeft -= gameState.penalty;
      } else {
        gameState.timeLeft = 0;
      }
    }

    function closeNumericPad() {
      gameState.showNumericPad = false;
      gameState.numericPadContext = null;
    }

    onMounted(() => {
      // If the timerRunning was restored as true, start it
      if (gameState.timerRunning) {
        startTimer();
      }
    });

    return {
      gameState,
      currentPageComponent,
      toggleTimer,
      applyPenalty,
      closeNumericPad,
    };
  },
};
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
```

---

### **MenuPage.vue**  
We add two new `<area>` elements in the map for **mute/unmute** and **reset timer**.  

```html
<template>
  <div class="menu-wrapper">
    <div class="outer-center">
      <div class="img-container">
        <img
          src="/images/menu.png"
          alt="Menu"
          usemap="#menuMap"
        />
        <!-- Show Timer only if we are in 'menu' page (or if you want it globally, that’s up to you) -->
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
import imageMapResize from 'image-map-resizer';

// Format time
const formatTime = (seconds) => {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const ss = (seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mm}:${ss}`;
};

function onMuteUnmute() {
  // Toggle muting
  gameState.isMuted = !gameState.isMuted;
  // If muting => stop music, etc.
  // If unmuting => resume music, etc.
}

function onResetTimer() {
  // Example: reset to 3600 seconds
  gameState.timeLeft = 3600;
}

function onPlayPause() {
  if (gameState.timerRunning) {
    stopTimer();
  } else {
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
 * Timer
 */
let timerInterval = null;

function startTimer() {
  if (timerInterval) return;
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
  // If the timer is marked as running in store, ensure we have an interval
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
```

---

### **NumericKeypad.vue**  
Here is where we modify the “result image” (step 3) to look like the menu style.  

- We hide the timer in step 3 by *not rendering it*, but we do *nothing to stop the countdown*.  
- We add an `<area>` for the “Exit” button, so clicking it returns to the menu.  

> **Important**: You can either replicate the entire “image + usemap” approach or do a simpler version. I’ll show an example with a simpler approach that uses the same `.img-container` style and an exit button area.  

```html
<template>
  <div class="overlay">
    <div class="modal" v-if="step < 3">
      <h2>{{ title }}</h2>
      
      <!-- Step 1: Ask card number -->
      <div v-if="step === 1">
        <p>Entrez le N° de carte :</p>
        <input v-model="cardNumber" type="number" />
        <button @click="validateCardNumber">Valider</button>
      </div>

      <!-- Step 2: For 'codes' only, ask 4-digit code -->
      <div v-else-if="step === 2 && context === 'codes'">
        <p>Entrez le code à 4 chiffres :</p>
        <input v-model="userCode" type="password" maxlength="4" />
        <button @click="validate4DigitsCode">Valider</button>
      </div>

      <button class="close-btn" @click="close">X</button>
    </div>

    <!-- Step 3: Show result image in the same style as the menu page (no timer) -->
    <div class="result-container" v-else>
      <div class="img-container">
        <img
          :src="`/images/${resultImage}`"
          alt="Result"
          usemap="#resultMap"
        />
      </div>
      <map name="resultMap">
        <!-- Example coords for the 'exit' button area
             (Adjust them to match your result image) -->
        <area
          shape="rect"
          coords="10,10,100,60"
          alt="Exit"
          href="#"
          @click.prevent="goBackToMenu"
        />
      </map>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { gameState } from '../store/gameStore.js';
import imageMapResize from 'image-map-resizer';

// Example tables
const INDICES_TABLE = {
  // ...
};
const OBJETS_TABLE = {
  // ...
};
const CODES_TABLE = {
  // ...
};

export default {
  name: 'NumericKeypad',
  props: ['context'],
  setup(props, { emit }) {
    const step = ref(1);
    const cardNumber = ref('');
    const userCode = ref('');
    const resultImage = ref('');

    const title = computed(() => {
      switch (props.context) {
        case 'indices': return 'Indices';
        case 'objets':  return 'Objets cachés';
        case 'codes':   return 'Code';
        default:        return 'Clavier numérique';
      }
    });

    function validateCardNumber() {
      const num = parseInt(cardNumber.value, 10);
      if (!num) return;

      gameState.lastEnteredCardNumber = num;

      if (props.context === 'indices') {
        if (INDICES_TABLE[num]) {
          resultImage.value = INDICES_TABLE[num][0]; // first image
        } else {
          resultImage.value = '66.jpg'; // fallback
        }
        step.value = 3; // show result
      }
      else if (props.context === 'objets') {
        if (OBJETS_TABLE[num]) {
          resultImage.value = OBJETS_TABLE[num][0];
        } else {
          resultImage.value = '54.jpg';
        }
        step.value = 3;
      }
      else if (props.context === 'codes') {
        // Go to step 2
        step.value = 2;
      }
    }

    function validate4DigitsCode() {
      const num = gameState.lastEnteredCardNumber;
      const entry = CODES_TABLE[num];
      if (!entry) {
        // wrong
        resultImage.value = '48.jpg';
        step.value = 3;
        return;
      }
      if (userCode.value === entry.code) {
        // correct
        resultImage.value = entry.newCard;
        // possibly play sounds
        step.value = 3;
      } else {
        // wrong
        resultImage.value = '48.jpg';
        step.value = 3;
      }
    }

    function close() {
      emit('close');
      step.value = 1;
      cardNumber.value = '';
      userCode.value = '';
      resultImage.value = '';
    }

    function goBackToMenu() {
      close(); // close the keypad
      // Also set page to 'menu'
      gameState.currentPage = 'menu';
    }

    onMounted(() => {
      imageMapResize(); // so the clickable area adjusts to the image
    });

    return {
      step,
      cardNumber,
      userCode,
      resultImage,
      title,
      validateCardNumber,
      validate4DigitsCode,
      close,
      goBackToMenu,
    };
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* on top */
}
.modal {
  background-color: #fff;
  padding: 1rem;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
/* Step 3 container: same style approach as .menu-wrapper */
.result-container {
  background-color: #fff;
  padding: 0.5rem;
  position: relative;
}
.img-container {
  position: relative;
  display: inline-block;
}
.img-container img {
  display: block;
  width: auto;
  height: auto;
  max-width: 90vw; /* or 100% */
  max-height: 90vh;
}
</style>
```

---

### **Key Points / Summary**  

- **Timer** is never stopped or reset automatically when showing an “image” (step 3). We only *hide* the visual representation.  
- **The ‘exit’ button** is an `<area>` in an `<img usemap="#resultMap">`. It calls a function that goes back to the menu.  
- **Mute/Unmute** and **Reset Timer** were added as clickable areas on the menu page.  
- **Timer not resetting on page refresh** is done by storing `timeLeft` and `timerRunning` in `localStorage` in `beforeunload`.  

You can adjust coordinates and styling to match your actual images.  