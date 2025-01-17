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
  
  // For all others (not in table), we display 66.jpg
  
  // Example of the “Objets cachés” table
  // cardNumber => [indice.png, reponse.png]
  const OBJETS_TABLE = {
    5:  ['55.png', '56.png'],
    27: ['57.png', '58.png'],
    16: ['59.png', '60.png'],
    15: ['61.png', '62.png'],
    99: ['63.png', '64.png'],
  };
  
  // Example of “Codes” table
  // cardNumber => { code: 'xxxx', newCard: 'xx.png' }
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
  