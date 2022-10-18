<template>
  <VDialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props }">
      <VBtn v-bind="props" color="red" depressed @click="dialog = true">
        <VIcon>mdi-delete</VIcon>
      </VBtn>
    </template>
    <VCard :loading="loading" :disabled="loading">
      <VAlert
        v-if="error"
        type="error"
        variant="outlined"
        prominent
        class="text-center"
      />
      <VCardTitle class="text-center">
        <span>Delete Item</span>
      </VCardTitle>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { auth, db } from "utils/firebase";
import { updateDoc, doc, arrayRemove } from "firebase/firestore";

const dialog = ref(false);
const loading = ref(false);
const error = ref("");
</script>
