<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="closeDialog()">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="red" :loading="dialog"> Clear Tab </v-btn>
    </template>
    <v-card :disabled="loading" :loading="loading">
      <v-alert type="error" v-if="error.code != null">
        <v-alert-title>
          {{ error.code }}
        </v-alert-title>
        {{ error.message }}
      </v-alert>
      <v-card-title>Are you sure?</v-card-title>
      <v-card-subtitle>this action cannot be undone.</v-card-subtitle>
      <v-card-text>
        Are you sure you want to clear the tab for
        <strong>{{ user?.info?.displayName }}</strong
        >?
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="green"
          @click="clearTab()"
          :disabled="loading"
          :loading="loading"
        >
          Confirm
        </v-btn>
        <v-btn color="red" @click="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { User } from "@/types";

// inject the user
const props = defineProps<{ user: User | null }>();

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
    await clearTab({ email: props.user?.info.email });
    dialog.value = false;
  } catch (err) {
    console.log(err);
    const { code, message } = err as { code: string; message: string };
    error.value = { code, message };
  } finally {
    loading.value = false;
  }
};

const closeDialog = () => {
  dialog.value = false;
  error.value = { code: null, message: null };
};
</script>
