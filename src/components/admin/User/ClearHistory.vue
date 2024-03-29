<script setup lang="ts">
import { callCloudFunction } from "@/composables";
import type { User } from "@/types";

// inject the user
const props = defineProps<{ user: User | null }>();

// reactive variables
const dialog = ref(false);
const loading = ref(false);
const error = ref({
  code: null,
  message: null,
} as { code: string | null; message: string | null });

const clearHistory = async () => {
  loading.value = true;
  try {
    if (props.user == null) return;
    const { email } = props.user.info;
    await callCloudFunction("clearHistory", { email });

    dialog.value = false;

    error.value = { code: null, message: null };
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

<template>
  <VDialog v-model="dialog" max-width="500px" @click:outside="closeDialog()">
    <template #activator="{ props }">
      <VBtn v-bind="props" color="error"> Clear History </VBtn>
    </template>
    <VCard :disabled="loading" :loading="loading">
      <VAlert type="error" v-if="error.code != null">
        <VAlertTitle>
          {{ error.code }}
        </VAlertTitle>
        {{ error.message }}
      </VAlert>
      <VCardTitle>Are you sure?</VCardTitle>
      <VCardSubtitle>this action cannot be undone.</VCardSubtitle>
      <VCardText>
        Are you sure you want to delete all history for
        <strong>{{ user?.info?.displayName }}</strong
        >?
      </VCardText>
      <VCardActions>
        <VBtn color="green" @click="clearHistory()"> Confirm </VBtn>
        <VBtn color="red" @click="dialog = false">Cancel</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
