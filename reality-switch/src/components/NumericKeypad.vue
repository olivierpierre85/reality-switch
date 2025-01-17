<!-- src/components/NumericKeypad.vue -->
<template>
  <div class="overlay">
    <!-- Step 1 & 2: Input Modal -->
    <div class="modal" v-if="step < 3">
      <h2>{{ title }}</h2>
      
      <!-- Step 1: Enter Card Number -->
      <div v-if="step === 1">
        <p>Entrez le N° de carte :</p>
        <input v-model="cardNumber" type="number" />
        <button @click="validateCardNumber">Valider</button>
      </div>

      <!-- Step 2: Enter 4-Digit Code (Only for 'codes' context) -->
      <div v-else-if="step === 2 && context === 'codes'">
        <p>Entrez le code à 4 chiffres :</p>
        <input v-model="userCode" type="password" maxlength="4" />
        <button @click="validate4DigitsCode">Valider</button>
      </div>

      <button class="close-btn" @click="close">X</button>
    </div>

    <!-- Step 3: Result Image with Exit Area -->
    <div class="result-container" v-else>
      <div class="img-container">
        <img
          :src="`/images/${resultImage}`"
          alt="Result"
          usemap="#resultMap"
          @load="onResultImageLoad"
        />
      </div>
      <map name="resultMap">
        <!-- Exit Button Area -->
        <area
          shape="rect"
          :coords="exitAreaCoords"
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

// Define your tables here or import them if they are defined elsewhere
const INDICES_TABLE = {
  7:  ['3.png', '4.png', '5.png'],
  8:  ['3.png', '4.png', '6.png'],
  9:  ['3.png', '4.png', '6.png'],
  10: ['7.png', '8.png', '9.png'],
  11: ['7.png', '8.png', '10.png'],
  12: ['7.png', '8.png', '9.png'],
  14: ['11.png', '12.png', '13.png'],
  54: ['14.png', '15.png', '16.png'],
  73: ['11.png', '12.png', '17.png'],
  26: ['18.png', '19.png', '20.png'],
  30: ['21.png', '22.png', '23.png'],
  36: ['24.png', '25.png', '26.png'],
  57: ['27.png', '28.png', '29.png'],
  67: ['27.png', '28.png', '31.png'],
  77: ['27.png', '28.png', '32.png'],
  87: ['27.png', '28.png', '30.png'],
  43: ['33.png', '34.png', '35.png'],
  44: ['33.png', '34.png', '36.png'],
  45: ['33.png', '34.png', '37.png'],
  46: ['33.png', '34.png', '38.png'],
  29: ['39.png', '40.png', '41.png'],
  3:  ['42.png', '43.png', '44.png'],
};

// For all others (not in table), we display 66.png

// Example of the “Objets cachés” table
const OBJETS_TABLE = {
  5:  ['55.png', '56.png'],
  27: ['57.png', '58.png'],
  16: ['59.png', '60.png'],
  15: ['61.png', '62.png'],
  99: ['63.png', '64.png'],
};

// Example of “Codes” table
const CODES_TABLE = {
  14: { code: '7248', newCard: '49.png' },
  73: { code: '3865', newCard: '50.png' },
  26: { code: '1945', newCard: '51.png' },
  29: { code: '1946', newCard: '52.png' },
  3:  { code: '9698', newCard: '53.png' },
};

export default {
  name: 'NumericKeypad',
  props: ['context'],
  setup(props, { emit }) {
    const step = ref(1);
    const cardNumber = ref('');
    const userCode = ref('');
    const resultImage = ref('');

    // Define exit area coordinates based on the natural image size
    const exitAreaCoordsMap = {
      '66.png': '558,37,674,155',
      '54.png': '558,37,674,155',
      '48.png': '558,37,674,155',
      // Add other images if their exit button positions differ
      // 'newCardImage.png': 'x1,y1,x2,y2',
    };

    const exitAreaCoords = computed(() => {
      return exitAreaCoordsMap[resultImage.value] || '558,37,674,155'; // default coords
    });

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

      // **New:** Reset objet index if a different card is selected
      if (gameState.lastEnteredCardNumber !== num && props.context === 'objets') {
        gameState.currentObjetIndex[num] = 0;
      }

      gameState.lastEnteredCardNumber = num;

      if (props.context === 'indices') {
        if (INDICES_TABLE[num] && INDICES_TABLE[num].length > 0) {
          // Get current indice index, default to 0
          const currentIndex = gameState.currentIndiceIndex[num] || 0;

          // Set resultImage
          resultImage.value = INDICES_TABLE[num][currentIndex];

          // Update the currentIndiceIndex for next time
          gameState.currentIndiceIndex[num] = (currentIndex + 1) % INDICES_TABLE[num].length;
        } else {
          // fallback
          resultImage.value = '66.png';
        }
        step.value = 3; // show result
      }
      else if (props.context === 'objets') {
        if (OBJETS_TABLE[num] && OBJETS_TABLE[num].length > 0) {
          // Get current objet index, default to 0
          const currentIndex = gameState.currentObjetIndex[num] || 0;

          // Set resultImage
          resultImage.value = OBJETS_TABLE[num][currentIndex];

          // Update the currentObjetIndex for next time
          gameState.currentObjetIndex[num] = (currentIndex + 1) % OBJETS_TABLE[num].length;
        } else {
          // fallback
          resultImage.value = '54.png';
        }
        step.value = 3; // show result
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
        resultImage.value = '48.png';
        step.value = 3;
        return;
      }
      if (userCode.value === entry.code) {
        // correct
        resultImage.value = entry.newCard;
        // Possibly play sounds
        step.value = 3;
      } else {
        // wrong
        resultImage.value = '48.png';
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
      // Set page to 'menu'
      gameState.currentPage = 'menu';
    }

    function onResultImageLoad() {
      // Initialize or re-initialize imageMapResize when a new result image is loaded
      imageMapResize();
    }

    onMounted(() => {
      // Initialize imageMapResize for the initial state if needed
      imageMapResize();
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
      onResultImageLoad,
      exitAreaCoords,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comic+Sans+MS&display=swap');

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
  z-index: 9999; /* Ensure it's on top */
}

/* Modal Styles for Steps 1 & 2 */
.modal {
  background-color: #0a425e;
  padding: 2rem;
  position: relative;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Result Container Styles for Step 3 */
.result-container {
  background-color: #0a425e;
  padding: 0; /* Remove padding */
  margin: 0;  /* Remove margin */
  position: relative;
  border-radius: 0; /* Remove border-radius if not needed */
  width: auto; /* Let the image define the width */
  max-width: none; /* Remove max-width constraint */
  box-shadow: none; /* Remove box-shadow for a cleaner look */
  display: flex;
  justify-content: center; /* Center the image horizontally */
  align-items: center;     /* Center the image vertically if needed */
}

/* Common Text Styles */
h2 {
  text-align: center;
  color: #ffffff;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  margin-bottom: 1.5rem;
}

p {
  text-align: center;
  color: #ffffff;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  margin-bottom: 1rem;
}

/* Input Styles */
input {
  display: block;
  width: 80%;
  margin: 0.5rem auto 1.5rem auto;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 1rem;
  text-align: center;
}

/* Button Styles */
button {
  display: block;
  margin: 0.5rem auto;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  color: #0a425e;
  border: none;
  border-radius: 5px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #e0e0e0;
}

/* Close Button Styles */
.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: transparent;
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
}

/* Image Container Styles */
.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.img-container img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%; /* Allow image to scale responsively */
  max-height: 100vh; /* Prevent image from exceeding viewport height */
}
</style>
