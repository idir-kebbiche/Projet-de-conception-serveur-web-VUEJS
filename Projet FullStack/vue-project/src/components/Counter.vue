<template>
    <div>
      <h1>Compteur : {{ compteur }}</h1>
      <button @click="incrementer">Incrémenter</button>
    </div>
  </template>
  
  <script setup>
  import { useMainStore } from '../stores/mainStore';
  import { storeToRefs } from 'pinia';
  
  const { compteur, incrementer } = storeToRefs(useMainStore());
  </script>
  