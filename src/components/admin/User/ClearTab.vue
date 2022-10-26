<script setup lang="ts">
import { inject, ref } from "vue";
import { functions } from "utils/firebase";
import { httpsCallable } from "@firebase/functions";
import type { User } from "types";

// inject the user
const user = inject("user") as User;

const dialog = ref(false);
const loading = ref(false);
const error = ref({
  code: null,
  message: null,
} as { code: string | null; message: string | null });

const clearTab = async () => {
  loading.value = true;
  try {
    const clearTab = httpsCallable(functions, "clearTab");
    await clearTab({ uid: user.info.uid });
    dialog.value = false;
  } catch (err) {
    console.log(err);
    const { code, message } = err as { code: string; message: string };
    error.value = { code, message };
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-dialog v-model="dialog" max-width="300px">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="red" :loading="dialog"> Clear Tab </v-btn>
    </template>
    <v-card :disabled="loading" :loading="loading">
      <v-card-title>Are you sure?</v-card-title>
      <v-card-subtitle>this action cannot be undone.</v-card-subtitle>
      <v-card-text>
        Are you sure you want to clear the tab for
        <strong>{{ user.info.displayName }}</strong
        >?
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          @click="clearTab()"
          :disabled="loading"
          :loading="loading"
        >
          Confirm
        </v-btn>
        <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
