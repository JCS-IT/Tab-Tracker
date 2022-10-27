<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="green-lighten-2" @click="dialog = true">
        Feedback
      </v-btn>
    </template>
    <v-card :loading="loading">
      <v-alert
        v-if="error.code"
        type="error"
        dismissible
        transition="scale-transition"
        elevation="2"
        color="red"
      >
        <v-alert-title>
          {{ error.code }}
        </v-alert-title>
        {{ error.message }}
      </v-alert>
      <v-card-title class="headline">Feedback Submission</v-card-title>
      <v-card-text>
        <v-form ref="inputForm">
          <v-textarea
            v-model="input"
            label="Feedback"
            placeholder="Enter your feedback here..."
            outlined
            rows="5"
            :rules="rules.text"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="green-lighten-2" text @click="submit">Submit</v-btn>
        <v-btn color="error" text @click="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { auth, db } from "@/firebase";
import { addDoc, Timestamp, collection } from "firebase/firestore";

const dialog = ref(false);

const input = ref("");

const inputForm = ref(null);

const loading = ref(false);

const error = ref({
  code: null,
  message: null,
} as { code: string | null; message: string | null });

const rules = {
  text: [(v: string) => !!v || "Field cannot be empty"],
};
const submit = async () => {
  // @ts-expect-error
  const { valid } = await inputForm.value.validate();

  if (!valid) return;

  loading.value = true;

  try {
    await addDoc(collection(db, "feedback"), {
      name: auth.currentUser?.displayName,
      email: auth.currentUser?.email,
      date: Timestamp.now(),
      text: input.value,
      debug: {
        app: {
          version: __APP_VERSION__,
          mode: import.meta.env.MODE,
        },
        device: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          vendor: navigator.vendor,
        },
        browser: {
          cookieEnabled: navigator.cookieEnabled,
          language: navigator.language,
          onLine: navigator.onLine,
        },
      },
    });

    close();
  } catch (err) {
    const { code, message } = err as { code: string; message: string };
    error.value = { code, message };

    console.log(error);
  } finally {
    loading.value = false;
  }
};

const close = () => {
  input.value = "";

  error.value = {
    code: null,
    message: null,
  };

  dialog.value = false;
};
</script>
