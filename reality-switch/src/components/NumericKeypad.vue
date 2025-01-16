<!-- src/components/NumericKeypad.vue -->
<template>
    <div class="overlay">
      <div class="modal">
        <h2>{{ title }}</h2>
  
        <!-- If context is 'indices' or 'objets' or 'codes' -->
        <div v-if="step === 1">
          <p>Entrez le N° de carte :</p>
          <input v-model="cardNumber" type="number" />
          <button @click="validateCardNumber">Valider</button>
        </div>
  
        <div v-else-if="step === 2 && context === 'codes'">
          <p>Entrez le code à 4 chiffres :</p>
          <input v-model="userCode" type="password" maxlength="4" />
          <button @click="validate4DigitsCode">Valider</button>
        </div>
  
        <!-- Show the result (image) if needed -->
        <div v-else-if="step === 3">
          <p>Résultat :</p>
          <img :src="`/images/${resultImage}`" alt="Result" />
          <button @click="close">OK</button>
        </div>
  
        <button class="close-btn" @click="$emit('close')">X</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { gameState } from '../store/gameStore.js';
  
  // Example of the "Indices" table from your doc, as an object
  // cardNumber => [indice1.jpg, indice2.jpg, reponse.jpg]
  const INDICES_TABLE = {
    7:  ['3.jpg', '4.jpg', '5.jpg'],
    8:  ['3.jpg', '4.jpg', '6.jpg'],
    9:  ['3.jpg', '4.jpg', '6.jpg'],
    10: ['7.jpg', '8.jpg', '9.jpg'],
    11: ['7.jpg', '8.jpg', '10.jpg'],
    12: ['7.jpg', '8.jpg', '9.jpg'],
    14: ['11.jpg','12.jpg','13.jpg'],
    // ...
  };
  
  // For all others (not in table), we display 66.jpg
  
  // Example of the “Objets cachés” table
  // cardNumber => [indice.jpg, reponse.jpg]
  const OBJETS_TABLE = {
    5:  ['55.jpg', '56.jpg'],
    27: ['57.jpg', '58.jpg'],
    16: ['59.jpg', '60.jpg'],
    15: ['61.jpg', '62.jpg'],
    99: ['63.jpg', '64.jpg'],
  };
  
  // Example of “Codes” table
  // cardNumber => { code: 'xxxx', newCard: 'xx.jpg' }
  const CODES_TABLE = {
    14: { code: '7248', newCard: '49.jpg' },
    73: { code: '3865', newCard: '50.jpg' },
    26: { code: '1945', newCard: '51.jpg' },
    29: { code: '1946', newCard: '52.jpg' },
    3:  { code: '9698', newCard: '53.jpg' },
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
        const num = parseInt(cardNumber.value);
        if (!num) return;
  
        // Store last entered card number in global store
        gameState.lastEnteredCardNumber = num;
  
        if (props.context === 'indices') {
          // 1) Check if cardNumber in INDICES_TABLE
          if (INDICES_TABLE[num]) {
            // Step 1 => Indice1
            resultImage.value = INDICES_TABLE[num][0];
            step.value = 3; // show result
          } else {
            // not found => show 66.jpg
            resultImage.value = '66.jpg';
            step.value = 3;
          }
        }
        else if (props.context === 'objets') {
          // For objets, we show directly the "indice" => step 3
          if (OBJETS_TABLE[num]) {
            resultImage.value = OBJETS_TABLE[num][0];
            step.value = 3;
          } else {
            // or a default?
            // The doc says: “Lorsqu’un indice (pour objet caché) est demandé → 54.jpg”
            // But that might be specifically for the “Indice” button, so adapt as needed.
            resultImage.value = '54.jpg';
            step.value = 3;
          }
        }
        else if (props.context === 'codes') {
          // For codes, we go to step 2 for 4-digit code
          step.value = 2;
        }
      }
  
      function validate4DigitsCode() {
        const num = gameState.lastEnteredCardNumber;
        const entry = CODES_TABLE[num];
        if (!entry) {
          // If there's no such card in the table => it’s automatically wrong
          resultImage.value = '48.jpg';
          // Play "faux.wav" (you can do it from here or a separate function)
          step.value = 3;
          return;
        }
  
        if (userCode.value === entry.code) {
          // Good code => new card
          resultImage.value = entry.newCard;
          // Trigger “vrai.wav” & special music if needed
          // Also check if it’s card 26 or 29 => play time machine + different music
          if (num === 26) {
            // play "machine temporelle.wav", then "musique2 - 1946.wav"
          } else if (num === 29) {
            // play "machine temporelle.wav", then "musique3 - Marshall.wav"
          }
          step.value = 3;
        } else {
          // Wrong code => 48.jpg
          resultImage.value = '48.jpg';
          // play "faux.wav"
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
  
      return {
        step, cardNumber, userCode, resultImage,
        title,
        validateCardNumber,
        validate4DigitsCode,
        close,
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
  </style>
  